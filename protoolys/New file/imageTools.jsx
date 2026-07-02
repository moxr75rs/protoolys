import React, { useState, useRef } from 'react';
import { Input, Button, Label, Icons } from './_common';

// Generic image converter using Canvas API
function useImage() {
  const [file, setFile] = useState(null);
  const [dataUrl, setDataUrl] = useState('');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [name, setName] = useState('');

  const onFile = (f) => {
    if (!f) return;
    setFile(f); setName(f.name);
    const r = new FileReader();
    r.onload = () => {
      setDataUrl(r.result);
      const img = new Image();
      img.onload = () => { setWidth(img.width); setHeight(img.height); };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  };
  return { file, dataUrl, width, height, name, onFile, reset: () => { setFile(null); setDataUrl(''); setWidth(0); setHeight(0); } };
}

function DropZone({ onFile, accept = 'image/*' }) {
  const inputRef = useRef();
  return (
    <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => onFile(e.target.files?.[0])} />
      <Icons.UploadCloud className="w-10 h-10 mx-auto text-indigo-500" />
      <p className="mt-3 font-semibold text-slate-700">Drop your image here or click to upload</p>
      <p className="mt-1 text-xs text-slate-500">PNG, JPG, WebP, BMP, GIF, ICO supported</p>
    </label>
  );
}

function Preview({ dataUrl, width, height, name }) {
  return (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">
          <div className="font-semibold text-slate-900 truncate max-w-xs">{name}</div>
          <div className="text-slate-500">{width} × {height}px</div>
        </div>
      </div>
      <img src={dataUrl} alt="preview" className="max-h-64 mx-auto rounded border border-slate-200" />
    </div>
  );
}

function DownloadBtn({ blob, filename, label = 'Download' }) {
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  return (
    <a href={url} download={filename} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
      <Icons.Download className="w-4 h-4" /> {label}
    </a>
  );
}

function convertImage(dataUrl, format, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      if (format === 'image/jpeg' || format === 'image/bmp') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
      ctx.drawImage(img, 0, 0);
      c.toBlob(blob => blob ? resolve(blob) : reject('failed'), format, quality);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function FormatConverter({ targetFormat, targetExt, mime, label }) {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const convert = async () => { setLoading(true); try { setBlob(await convertImage(dataUrl, mime)); } catch (e) {} setLoading(false); };
  const outName = (name || 'image').replace(/\.[^.]+$/, '') + '.' + targetExt;
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={convert} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Sparkles className="w-4 h-4 mr-1" />} Convert to {targetExt.toUpperCase()}
            </Button>
            <DownloadBtn blob={blob} filename={outName} label={`Download ${targetExt.toUpperCase()}`} />
          </div>
        </>
      )}
    </div>
  );
}

// Specific converters
export const JPGToPNG = () => <FormatConverter targetExt="png" mime="image/png" />;
export const PNGToJPG = () => <FormatConverter targetExt="jpg" mime="image/jpeg" />;
export const JPGConverter = () => <FormatConverter targetExt="jpg" mime="image/jpeg" />;
export const WebPToJPG = () => <FormatConverter targetExt="jpg" mime="image/jpeg" />;
export const PNGToWebP = () => <FormatConverter targetExt="webp" mime="image/webp" />;
export const PNGToBMP = () => <FormatConverter targetExt="bmp" mime="image/bmp" />;
export const PNGToGIF = () => <FormatConverter targetExt="gif" mime="image/gif" />;
export const JPGToWebP = () => <FormatConverter targetExt="webp" mime="image/webp" />;
export const JPGToBMP = () => <FormatConverter targetExt="bmp" mime="image/bmp" />;
export const JPGToGIF = () => <FormatConverter targetExt="gif" mime="image/gif" />;
export const WebPToPNG = () => <FormatConverter targetExt="png" mime="image/png" />;

// ICO converters (use 256x256 PNG inside ICO container — browsers actually accept PNG renamed to .ico for favicons, so we package PNG)
function buildICO(pngBlob) {
  return new Promise(async (resolve) => {
    const ab = await pngBlob.arrayBuffer();
    const png = new Uint8Array(ab);
    // ICO header: ICONDIR (6) + ICONDIRENTRY (16) + PNG bytes
    const header = new Uint8Array(22);
    const view = new DataView(header.buffer);
    view.setUint16(0, 0, true); view.setUint16(2, 1, true); view.setUint16(4, 1, true);
    view.setUint8(6, 0); view.setUint8(7, 0); view.setUint8(8, 0); view.setUint8(9, 0);
    view.setUint16(10, 1, true); view.setUint16(12, 32, true);
    view.setUint32(14, png.length, true); view.setUint32(18, 22, true);
    const out = new Uint8Array(22 + png.length);
    out.set(header, 0); out.set(png, 22);
    resolve(new Blob([out], { type: 'image/x-icon' }));
  });
}
function ResizedICO() {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const convert = async () => {
    setLoading(true);
    try {
      const img = new Image(); img.src = dataUrl;
      await new Promise(r => img.onload = r);
      const c = document.createElement('canvas'); c.width = 256; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 256, 256);
      const png = await new Promise(r => c.toBlob(r, 'image/png'));
      setBlob(await buildICO(png));
    } catch {}
    setLoading(false);
  };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={convert} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Sparkles className="w-4 h-4 mr-1" />} Generate ICO</Button>
            <DownloadBtn blob={blob} filename={(name || 'favicon').replace(/\.[^.]+$/, '') + '.ico'} label="Download .ico" />
          </div>
        </>
      )}
    </div>
  );
}
export const PNGToICO = ResizedICO;
export const JPGToICO = ResizedICO;
export const ICOConverter = ResizedICO;
export const ICOToPNG = () => <FormatConverter targetExt="png" mime="image/png" />;

// Image Resizer
export const ImageResizer = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [w, setW] = useState(0); const [h, setH] = useState(0); const [keep, setKeep] = useState(true);
  const [blob, setBlob] = useState(null);
  React.useEffect(() => { setW(width); setH(height); }, [width, height]);
  const resize = async () => {
    const img = new Image(); img.src = dataUrl; await new Promise(r => img.onload = r);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    setBlob(await new Promise(r => c.toBlob(r, 'image/png')));
  };
  const onWChange = (val) => { setW(val); if (keep && width) setH(Math.round(val * height / width)); };
  const onHChange = (val) => { setH(val); if (keep && height) setW(Math.round(val * width / height)); };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><Label>Width (px)</Label><Input type="number" value={w} onChange={e => onWChange(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
            <div><Label>Height (px)</Label><Input type="number" value={h} onChange={e => onHChange(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={keep} onChange={e => setKeep(e.target.checked)} className="accent-indigo-600" /> Maintain aspect ratio</label></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={resize} className="bg-indigo-600 hover:bg-indigo-700 text-white">Resize</Button>
            <DownloadBtn blob={blob} filename={(name || 'resized').replace(/\.[^.]+$/, '') + '_resized.png'} />
          </div>
        </>
      )}
    </div>
  );
};

// Image Enlarger (2x, 3x, 4x)
export const ImageEnlarger = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [scale, setScale] = useState(2);
  const [blob, setBlob] = useState(null);
  const enlarge = async () => {
    const img = new Image(); img.src = dataUrl; await new Promise(r => img.onload = r);
    const c = document.createElement('canvas'); c.width = width * scale; c.height = height * scale;
    const ctx = c.getContext('2d'); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    setBlob(await new Promise(r => c.toBlob(r, 'image/png')));
  };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 flex items-center gap-3">
            <Label>Scale:</Label>
            {[2,3,4].map(s => <Button key={s} variant={scale === s ? 'default' : 'outline'} onClick={() => setScale(s)} className={scale === s ? 'bg-indigo-600 hover:bg-indigo-700' : ''}>{s}x</Button>)}
            <span className="text-sm text-slate-500">→ {width * scale} × {height * scale}px</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={enlarge} className="bg-indigo-600 hover:bg-indigo-700 text-white">Enlarge</Button>
            <DownloadBtn blob={blob} filename={(name || 'enlarged').replace(/\.[^.]+$/, '') + `_${scale}x.png`} />
          </div>
        </>
      )}
    </div>
  );
};

// Rotate Image
export const ImageRotate = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [angle, setAngle] = useState(90);
  const [blob, setBlob] = useState(null);
  const rotate = async () => {
    const img = new Image(); img.src = dataUrl; await new Promise(r => img.onload = r);
    const c = document.createElement('canvas');
    const rad = angle * Math.PI / 180;
    const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
    c.width = width * cos + height * sin; c.height = width * sin + height * cos;
    const ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2); ctx.rotate(rad);
    ctx.drawImage(img, -width / 2, -height / 2);
    setBlob(await new Promise(r => c.toBlob(r, 'image/png')));
  };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Label>Rotate:</Label>
            {[90, 180, 270].map(a => <Button key={a} variant={angle === a ? 'default' : 'outline'} onClick={() => setAngle(a)} className={angle === a ? 'bg-indigo-600 hover:bg-indigo-700' : ''}>{a}°</Button>)}
            <Input type="number" value={angle} onChange={e => setAngle(parseInt(e.target.value) || 0)} className="w-24" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={rotate} className="bg-indigo-600 hover:bg-indigo-700 text-white">Rotate</Button>
            <DownloadBtn blob={blob} filename={(name || 'rotated').replace(/\.[^.]+$/, '') + '_rotated.png'} />
          </div>
        </>
      )}
    </div>
  );
};

// Flip Image
export const ImageFlip = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [dir, setDir] = useState('horizontal');
  const [blob, setBlob] = useState(null);
  const flip = async () => {
    const img = new Image(); img.src = dataUrl; await new Promise(r => img.onload = r);
    const c = document.createElement('canvas'); c.width = width; c.height = height;
    const ctx = c.getContext('2d');
    if (dir === 'horizontal') { ctx.translate(width, 0); ctx.scale(-1, 1); }
    else { ctx.translate(0, height); ctx.scale(1, -1); }
    ctx.drawImage(img, 0, 0);
    setBlob(await new Promise(r => c.toBlob(r, 'image/png')));
  };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 flex items-center gap-2">
            <Button variant={dir === 'horizontal' ? 'default' : 'outline'} onClick={() => setDir('horizontal')} className={dir === 'horizontal' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}><Icons.FlipHorizontal className="w-4 h-4 mr-1" /> Horizontal</Button>
            <Button variant={dir === 'vertical' ? 'default' : 'outline'} onClick={() => setDir('vertical')} className={dir === 'vertical' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}><Icons.FlipVertical className="w-4 h-4 mr-1" /> Vertical</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={flip} className="bg-indigo-600 hover:bg-indigo-700 text-white">Flip</Button>
            <DownloadBtn blob={blob} filename={(name || 'flipped').replace(/\.[^.]+$/, '') + '_flipped.png'} />
          </div>
        </>
      )}
    </div>
  );
};

// Image Cropper (simple center crop with sliders)
export const ImageCropper = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [x, setX] = useState(0); const [y, setY] = useState(0);
  const [cw, setCw] = useState(0); const [ch, setCh] = useState(0);
  const [blob, setBlob] = useState(null);
  React.useEffect(() => { if (width) { setCw(Math.floor(width * 0.8)); setCh(Math.floor(height * 0.8)); setX(Math.floor(width * 0.1)); setY(Math.floor(height * 0.1)); }}, [width, height]);
  const crop = async () => {
    const img = new Image(); img.src = dataUrl; await new Promise(r => img.onload = r);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    c.getContext('2d').drawImage(img, x, y, cw, ch, 0, 0, cw, ch);
    setBlob(await new Promise(r => c.toBlob(r, 'image/png')));
  };
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><Label>X offset</Label><Input type="number" value={x} max={width} onChange={e => setX(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
            <div><Label>Y offset</Label><Input type="number" value={y} max={height} onChange={e => setY(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
            <div><Label>Width</Label><Input type="number" value={cw} onChange={e => setCw(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
            <div><Label>Height</Label><Input type="number" value={ch} onChange={e => setCh(parseInt(e.target.value) || 0)} className="mt-1.5" /></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={crop} className="bg-indigo-600 hover:bg-indigo-700 text-white">Crop</Button>
            <DownloadBtn blob={blob} filename={(name || 'cropped').replace(/\.[^.]+$/, '') + '_cropped.png'} />
          </div>
        </>
      )}
    </div>
  );
};

// Generic Image Converter (choose output format)
export const ImageConverterTool = () => {
  const { dataUrl, width, height, name, onFile, reset } = useImage();
  const [fmt, setFmt] = useState('image/png');
  const [blob, setBlob] = useState(null);
  const convert = async () => { setBlob(await convertImage(dataUrl, fmt, 0.92)); };
  const ext = fmt.split('/')[1].replace('jpeg', 'jpg');
  return (
    <div>
      {!dataUrl ? <DropZone onFile={onFile} /> : (
        <>
          <Preview dataUrl={dataUrl} width={width} height={height} name={name} />
          <div className="mt-4">
            <Label>Output format</Label>
            <select value={fmt} onChange={e => setFmt(e.target.value)} className="mt-1.5 h-10 w-full sm:w-48 border border-slate-200 rounded-md px-3 text-sm bg-white">
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
              <option value="image/bmp">BMP</option>
              <option value="image/gif">GIF</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={reset}>Reset</Button>
            <Button onClick={convert} className="bg-indigo-600 hover:bg-indigo-700 text-white">Convert</Button>
            <DownloadBtn blob={blob} filename={(name || 'image').replace(/\.[^.]+$/, '') + '.' + ext} />
          </div>
        </>
      )}
    </div>
  );
};
