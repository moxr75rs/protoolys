import React, { useState, useRef } from 'react';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import { Input, Button, Label, Icons } from './_common';

function PDFDropZone({ onFile, multiple = false, accept = 'application/pdf' }) {
  return (
    <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
      <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={e => onFile(multiple ? Array.from(e.target.files) : e.target.files[0])} />
      <Icons.FilePlus2 className="w-10 h-10 mx-auto text-indigo-500" />
      <p className="mt-3 font-semibold text-slate-700">Drop your PDF{multiple ? ' files' : ''} here or click to upload</p>
    </label>
  );
}

function DownloadResult({ blob, filename }) {
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  return (
    <a href={url} download={filename} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">
      <Icons.Download className="w-4 h-4" /> Download {filename}
    </a>
  );
}

function FileBadge({ files, onRemove }) {
  return (
    <div className="mt-4 space-y-2">
      {files.map((f, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <Icons.FileText className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-medium text-slate-700 truncate flex-1">{f.name}</span>
          <span className="text-xs text-slate-500">{(f.size / 1024).toFixed(1)} KB</span>
          {onRemove && <button onClick={() => onRemove(i)} className="text-slate-400 hover:text-rose-600"><Icons.X className="w-4 h-4" /></button>}
        </div>
      ))}
    </div>
  );
}

export const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const onAdd = (newFiles) => setFiles(prev => [...prev, ...newFiles]);
  const remove = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));
  const merge = async () => {
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const out = await merged.save();
      setBlob(new Blob([out], { type: 'application/pdf' }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  return (
    <div>
      <PDFDropZone onFile={onAdd} multiple />
      {files.length > 0 && <FileBadge files={files} onRemove={remove} />}
      {files.length >= 2 && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setFiles([]); setBlob(null); }}>Clear</Button>
          <Button onClick={merge} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Combine className="w-4 h-4 mr-1" />} Merge {files.length} PDFs</Button>
          <DownloadResult blob={blob} filename="merged.pdf" />
        </div>
      )}
    </div>
  );
};

export const SplitPDF = () => {
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState('1-1, 2-2');
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const onFile = async (f) => {
    setFile(f);
    const src = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(src.getPageCount());
    setRanges(`1-${src.getPageCount()}`);
  };
  const split = async () => {
    setLoading(true);
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const parts = ranges.split(',').map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        const [a, b] = part.split('-').map(n => parseInt(n) - 1);
        const end = isNaN(b) ? a : b;
        for (let i = a; i <= end && i < src.getPageCount(); i++) {
          const [p] = await out.copyPages(src, [i]);
          out.addPage(p);
        }
      }
      const bytes = await out.save();
      setBlob(new Blob([bytes], { type: 'application/pdf' }));
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={onFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4"><Label>Page ranges (e.g. 1-3, 5-5, 7-10) — total pages: {pageCount}</Label><Input value={ranges} onChange={e => setRanges(e.target.value)} className="mt-1.5" /></div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={split} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Scissors className="w-4 h-4 mr-1" />} Split</Button>
            <DownloadResult blob={blob} filename="split.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const RotatePDF = () => {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [blob, setBlob] = useState(null);
  const rotate = async () => {
    const src = await PDFDocument.load(await file.arrayBuffer());
    src.getPages().forEach(p => p.setRotation(degrees(angle)));
    setBlob(new Blob([await src.save()], { type: 'application/pdf' }));
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Label>Rotation:</Label>
            {[90, 180, 270].map(a => <Button key={a} variant={angle === a ? 'default' : 'outline'} onClick={() => setAngle(a)} className={angle === a ? 'bg-indigo-600 hover:bg-indigo-700' : ''}>{a}°</Button>)}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={rotate} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.RotateCw className="w-4 h-4 mr-1" /> Rotate</Button>
            <DownloadResult blob={blob} filename="rotated.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const WatermarkPDF = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [blob, setBlob] = useState(null);
  const apply = async () => {
    const src = await PDFDocument.load(await file.arrayBuffer());
    const font = await src.embedFont(StandardFonts.HelveticaBold);
    src.getPages().forEach(p => {
      const { width, height } = p.getSize();
      const size = Math.min(width, height) / 8;
      p.drawText(text, { x: width / 2 - (text.length * size) / 4, y: height / 2, size, font, color: rgb(0.7, 0, 0), opacity, rotate: degrees(45) });
    });
    setBlob(new Blob([await src.save()], { type: 'application/pdf' }));
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><Label>Watermark text</Label><Input value={text} onChange={e => setText(e.target.value)} className="mt-1.5" /></div>
            <div><Label>Opacity: {opacity}</Label><input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-full mt-2 accent-indigo-600" /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Droplets className="w-4 h-4 mr-1" /> Add watermark</Button>
            <DownloadResult blob={blob} filename="watermarked.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const PageNumbersPDF = () => {
  const [file, setFile] = useState(null);
  const [pos, setPos] = useState('bottom-center');
  const [blob, setBlob] = useState(null);
  const apply = async () => {
    const src = await PDFDocument.load(await file.arrayBuffer());
    const font = await src.embedFont(StandardFonts.Helvetica);
    src.getPages().forEach((p, i) => {
      const { width, height } = p.getSize();
      const text = `${i + 1} / ${src.getPageCount()}`;
      const size = 11;
      let x = width / 2 - (text.length * size) / 5, y = 20;
      if (pos === 'bottom-left') x = 30;
      if (pos === 'bottom-right') x = width - 60;
      if (pos === 'top-center') y = height - 30;
      if (pos === 'top-left') { x = 30; y = height - 30; }
      if (pos === 'top-right') { x = width - 60; y = height - 30; }
      p.drawText(text, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
    });
    setBlob(new Blob([await src.save()], { type: 'application/pdf' }));
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4"><Label>Position</Label>
            <select value={pos} onChange={e => setPos(e.target.value)} className="mt-1.5 h-10 w-full sm:w-64 border border-slate-200 rounded-md px-3 text-sm bg-white">
              <option value="bottom-center">Bottom center</option><option value="bottom-left">Bottom left</option><option value="bottom-right">Bottom right</option>
              <option value="top-center">Top center</option><option value="top-left">Top left</option><option value="top-right">Top right</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Hash className="w-4 h-4 mr-1" /> Add page numbers</Button>
            <DownloadResult blob={blob} filename="numbered.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const JPGtoPDF = () => {
  const [files, setFiles] = useState([]);
  const [blob, setBlob] = useState(null);
  const convert = async () => {
    const doc = await PDFDocument.create();
    for (const f of files) {
      const bytes = await f.arrayBuffer();
      const img = /\.png$/i.test(f.name) ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    setBlob(new Blob([await doc.save()], { type: 'application/pdf' }));
  };
  return (
    <div>
      <PDFDropZone onFile={(f) => setFiles(prev => [...prev, ...f])} multiple accept="image/jpeg,image/png" />
      {files.length > 0 && <FileBadge files={files} onRemove={(i) => setFiles(prev => prev.filter((_, idx) => idx !== i))} />}
      {files.length > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setFiles([]); setBlob(null); }}>Clear</Button>
          <Button onClick={convert} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.FileText className="w-4 h-4 mr-1" /> Create PDF</Button>
          <DownloadResult blob={blob} filename="images.pdf" />
        </div>
      )}
    </div>
  );
};

export const PDFtoJPG = () => {
  // Lazy-load pdfjs to avoid blocking initial bundle
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const convert = async () => {
    setLoading(true);
    try {
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs`;
      const buf = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buf }).promise;
      const results = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const c = document.createElement('canvas');
        c.width = vp.width; c.height = vp.height;
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        results.push(c.toDataURL('image/jpeg', 0.92));
      }
      setImages(results);
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setImages([]); }}>Reset</Button>
            <Button onClick={convert} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">{loading ? <Icons.Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Icons.Image className="w-4 h-4 mr-1" />} Convert to JPG</Button>
          </div>
          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((src, i) => (
                <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                  <img src={src} alt={`page ${i+1}`} className="w-full" />
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Page {i+1}</span>
                    <a href={src} download={`page-${i+1}.jpg`} className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"><Icons.Download className="w-3 h-3" /> JPG</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const ProtectPDF = () => {
  const [file, setFile] = useState(null);
  const [pwd, setPwd] = useState('');
  const [blob, setBlob] = useState(null);
  const [info, setInfo] = useState('');
  const apply = async () => {
    // pdf-lib does not support password protection on free tier.
    // We simulate with metadata flag + alert
    const src = await PDFDocument.load(await file.arrayBuffer());
    src.setTitle('Protected by Protooly');
    src.setSubject(`Password hint: ${pwd ? pwd[0] + '***' : 'n/a'}`);
    setBlob(new Blob([await src.save()], { type: 'application/pdf' }));
    setInfo('Metadata applied. For true encryption use Adobe Acrobat or qpdf — pdf-lib does not support AES.');
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4"><Label>Password (metadata only)</Label><Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} className="mt-1.5" /></div>
          {info && <div className="mt-3 p-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-sm">{info}</div>}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Lock className="w-4 h-4 mr-1" /> Tag as protected</Button>
            <DownloadResult blob={blob} filename="protected.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const OrganizePDF = () => {
  const [file, setFile] = useState(null);
  const [order, setOrder] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [blob, setBlob] = useState(null);
  const onFile = async (f) => { setFile(f); const src = await PDFDocument.load(await f.arrayBuffer()); setPageCount(src.getPageCount()); setOrder(Array.from({length: src.getPageCount()}, (_, i) => i+1).join(',')); };
  const apply = async () => {
    const src = await PDFDocument.load(await file.arrayBuffer());
    const out = await PDFDocument.create();
    for (const idx of order.split(/[,\s]+/).map(n => parseInt(n) - 1).filter(n => !isNaN(n) && n >= 0 && n < src.getPageCount())) {
      const [p] = await out.copyPages(src, [idx]);
      out.addPage(p);
    }
    setBlob(new Blob([await out.save()], { type: 'application/pdf' }));
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={onFile} /> : (
        <>
          <FileBadge files={[file]} />
          <div className="mt-4"><Label>Page order (comma-separated, total {pageCount})</Label><Input value={order} onChange={e => setOrder(e.target.value)} className="mt-1.5 font-mono" /></div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); }}>Reset</Button>
            <Button onClick={apply} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Layers className="w-4 h-4 mr-1" /> Reorder</Button>
            <DownloadResult blob={blob} filename="organized.pdf" />
          </div>
        </>
      )}
    </div>
  );
};

export const CompressPDF = () => {
  const [file, setFile] = useState(null);
  const [blob, setBlob] = useState(null);
  const [info, setInfo] = useState(null);
  const compress = async () => {
    const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    const bytes = await src.save({ useObjectStreams: true });
    const newBlob = new Blob([bytes], { type: 'application/pdf' });
    setBlob(newBlob);
    setInfo({ original: file.size, compressed: newBlob.size });
  };
  return (
    <div>
      {!file ? <PDFDropZone onFile={setFile} /> : (
        <>
          <FileBadge files={[file]} />
          {info && <div className="mt-3 grid grid-cols-3 gap-3"><div className="p-3 bg-slate-50 border border-slate-200 rounded-lg"><div className="text-xs text-slate-500">Original</div><div className="font-bold">{(info.original/1024).toFixed(1)} KB</div></div><div className="p-3 bg-slate-50 border border-slate-200 rounded-lg"><div className="text-xs text-slate-500">Compressed</div><div className="font-bold">{(info.compressed/1024).toFixed(1)} KB</div></div><div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg"><div className="text-xs text-emerald-700">Savings</div><div className="font-bold text-emerald-800">{(((info.original - info.compressed)/info.original)*100).toFixed(1)}%</div></div></div>}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setFile(null); setBlob(null); setInfo(null); }}>Reset</Button>
            <Button onClick={compress} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Icons.Archive className="w-4 h-4 mr-1" /> Compress</Button>
            <DownloadResult blob={blob} filename="compressed.pdf" />
          </div>
        </>
      )}
    </div>
  );
};
