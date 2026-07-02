import React, { useState } from 'react';
import { Input, Button, Label, Icons, CopyBtn } from './_common';

const UNITS = {
  length: { base: 'm', units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  weight: { base: 'kg', units: { mg: 1e-6, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592 } },
  area: { base: 'm2', units: { 'mm²':1e-6, 'cm²':1e-4, 'm²':1, 'km²':1e6, ha:10000, acre:4046.86, 'ft²':0.092903 } },
  volume: { base: 'L', units: { ml:0.001, L:1, m3:1000, gal_us:3.78541, qt:0.946353, pt:0.473176, cup:0.24 } },
  temperature: { custom: true },
  time: { base: 's', units: { ms:0.001, s:1, min:60, hr:3600, day:86400, week:604800, year:31557600 } },
  digital: { base: 'B', units: { bit:0.125, B:1, KB:1024, MB:1048576, GB:1073741824, TB:1099511627776 } },
  speed: { base: 'm/s', units: { 'm/s':1, 'km/h':0.27778, 'mph':0.44704, knot:0.51444 } },
  pressure: { base: 'Pa', units: { Pa:1, kPa:1000, bar:100000, psi:6894.76, atm:101325 } },
  current: { base: 'A', units: { 'mA':0.001, 'A':1, 'kA':1000 } },
  voltage: { base: 'V', units: { 'mV':0.001, 'V':1, 'kV':1000 } },
  power: { base: 'W', units: { 'mW':0.001, 'W':1, 'kW':1000, 'MW':1e6, hp:745.7 } },
  energy: { base: 'J', units: { 'J':1, 'kJ':1000, 'cal':4.184, 'kcal':4184, 'Wh':3600, 'kWh':3600000 } },
  frequency: { base: 'Hz', units: { 'Hz':1, 'kHz':1000, 'MHz':1e6, 'GHz':1e9 } },
  angle: { base: 'deg', units: { deg:1, rad:57.2958, grad:0.9 } },
  torque: { base: 'Nm', units: { 'Nm':1, 'kgf·m':9.80665, 'lbf·ft':1.35582 } },
  charge: { base: 'C', units: { 'mC':0.001, 'C':1, 'kC':1000, 'mAh':3.6, 'Ah':3600 } },
};

function Converter({ kind }) {
  const cfg = UNITS[kind]; const keys = cfg.custom ? ['C','F','K'] : Object.keys(cfg.units);
  const [val, setVal] = useState(1); const [from, setFrom] = useState(keys[0]); const [to, setTo] = useState(keys[1]||keys[0]);
  let result = '';
  if (cfg.custom) { // temperature
    let c = parseFloat(val); if (from==='F') c=(c-32)*5/9; if (from==='K') c=c-273.15;
    if (to==='C') result=c.toFixed(4); if (to==='F') result=(c*9/5+32).toFixed(4); if (to==='K') result=(c+273.15).toFixed(4);
  } else {
    const baseVal = parseFloat(val)*cfg.units[from]; result = (baseVal/cfg.units[to]).toLocaleString(undefined, { maximumFractionDigits: 8 });
  }
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label>Value</Label><Input type="number" value={val} onChange={e=>setVal(e.target.value)} className="mt-1.5" /></div>
        <div><Label>From</Label><select value={from} onChange={e=>setFrom(e.target.value)} className="mt-1.5 h-10 w-full border border-slate-200 rounded-md px-3 text-sm bg-white">{keys.map(k=><option key={k}>{k}</option>)}</select></div>
        <div><Label>To</Label><select value={to} onChange={e=>setTo(e.target.value)} className="mt-1.5 h-10 w-full border border-slate-200 rounded-md px-3 text-sm bg-white">{keys.map(k=><option key={k}>{k}</option>)}</select></div>
      </div>
      <div className="mt-5 p-5 rounded-xl bg-indigo-50 border border-indigo-100"><div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Result</div><div className="text-3xl font-bold text-slate-900 mt-1">{val} {from} = <span className="text-indigo-700">{result}</span> {to}</div></div>
    </div>
  );
}

export const LengthConverter = () => <Converter kind="length" />;
export const WeightConverter = () => <Converter kind="weight" />;
export const AreaConverter = () => <Converter kind="area" />;
export const VolumeConverter = () => <Converter kind="volume" />;
export const TemperatureConverter = () => <Converter kind="temperature" />;
export const TimeConverter = () => <Converter kind="time" />;
export const DigitalConverter = () => <Converter kind="digital" />;
export const SpeedConverter = () => <Converter kind="speed" />;
export const PressureConverter = () => <Converter kind="pressure" />;
export const CurrentConverter = () => <Converter kind="current" />;
export const VoltageConverter = () => <Converter kind="voltage" />;
export const PowerConverter = () => <Converter kind="power" />;
export const EnergyConverter = () => <Converter kind="energy" />;
export const FrequencyConverter = () => <Converter kind="frequency" />;
export const AngleConverter = () => <Converter kind="angle" />;
export const TorqueConverter = () => <Converter kind="torque" />;
export const ChargeConverter = () => <Converter kind="charge" />;

// Currency — static demo rates
const CURRENCIES = { USD:1, EUR:0.92, GBP:0.79, INR:83.5, JPY:155.3, AUD:1.52, CAD:1.36, CNY:7.24, BRL:5.45, MXN:17.05, SAR:3.75, AED:3.67 };
export const CurrencyConverter = () => { const [v, setV] = useState(100); const [from, setFrom] = useState('USD'); const [to, setTo] = useState('EUR'); const r = (v / CURRENCIES[from] * CURRENCIES[to]).toFixed(4); return (<div><div className="text-xs text-slate-500 mb-3 p-2 bg-amber-50 border border-amber-200 rounded">Demo rates — connect a live API for production use.</div><div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div><Label>Amount</Label><Input type="number" value={v} onChange={e=>setV(e.target.value)} className="mt-1.5" /></div><div><Label>From</Label><select value={from} onChange={e=>setFrom(e.target.value)} className="mt-1.5 h-10 w-full border border-slate-200 rounded-md px-3 text-sm bg-white">{Object.keys(CURRENCIES).map(c=><option key={c}>{c}</option>)}</select></div><div><Label>To</Label><select value={to} onChange={e=>setTo(e.target.value)} className="mt-1.5 h-10 w-full border border-slate-200 rounded-md px-3 text-sm bg-white">{Object.keys(CURRENCIES).map(c=><option key={c}>{c}</option>)}</select></div></div><div className="mt-5 p-5 rounded-xl bg-indigo-50 border border-indigo-100"><div className="text-3xl font-bold text-slate-900">{v} {from} = <span className="text-indigo-700">{r}</span> {to}</div></div></div>); };

// Number system converters
const convertBase = (val, from, to) => { if (!val) return ''; try { return parseInt(val, from).toString(to); } catch(e){ return 'Invalid'; }};
const textToCodes = (text, base) => text.split('').map(c => c.charCodeAt(0).toString(base).padStart(base===2?8:base===16?2:3,'0')).join(' ');
const codesToText = (codes, base) => codes.trim().split(/\s+/).map(c => String.fromCharCode(parseInt(c, base))).join('');

const PairTool = ({ left='Input', right='Output', convert, sample='' }) => { const [input, setInput] = useState(sample); return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label>{left}</Label><textarea value={input} onChange={e=>setInput(e.target.value)} className="mt-1.5 w-full min-h-[180px] border border-slate-200 rounded-md p-3 font-mono text-sm" /></div><div><div className="flex items-center justify-between"><Label>{right}</Label><CopyBtn value={convert(input)} /></div><textarea readOnly value={convert(input)} className="mt-1.5 w-full min-h-[180px] border border-slate-200 rounded-md p-3 font-mono text-sm bg-slate-50" /></div></div>); };

export const TextToBinary = () => <PairTool left="Text" right="Binary" convert={s=>s?textToCodes(s,2):''} sample="Hello" />;
export const BinaryToText = () => <PairTool left="Binary" right="Text" convert={s=>s?codesToText(s,2):''} sample="01001000 01101001" />;
export const TextToHex = () => <PairTool left="Text" right="HEX" convert={s=>s?textToCodes(s,16):''} sample="Hi" />;
export const HexToText = () => <PairTool left="HEX" right="Text" convert={s=>s?codesToText(s,16):''} sample="48 69" />;
export const TextToOctal = () => <PairTool left="Text" right="Octal" convert={s=>s?textToCodes(s,8):''} />;
export const OctalToText = () => <PairTool left="Octal" right="Text" convert={s=>s?codesToText(s,8):''} />;
export const TextToDecimal = () => <PairTool left="Text" right="Decimal" convert={s=>s?textToCodes(s,10):''} />;
export const DecimalToText = () => <PairTool left="Decimal" right="Text" convert={s=>s?codesToText(s,10):''} />;
export const TextToASCII = () => <PairTool left="Text" right="ASCII" convert={s=>s.split('').map(c=>c.charCodeAt(0)).join(' ')} />;
export const ASCIIToText = () => <PairTool left="ASCII" right="Text" convert={s=>s.trim().split(/\s+/).map(n=>String.fromCharCode(parseInt(n))).join('')} />;
export const ASCIIToBinary = () => <PairTool left="ASCII" right="Binary" convert={s=>s.trim().split(/\s+/).map(n=>parseInt(n).toString(2).padStart(8,'0')).join(' ')} />;
export const BinaryToASCII = () => <PairTool left="Binary" right="ASCII" convert={s=>s.trim().split(/\s+/).map(b=>parseInt(b,2)).join(' ')} />;

export const DecimalToBinary = () => <PairTool left="Decimal" right="Binary" convert={s=>s?convertBase(s,10,2):''} sample="42" />;
export const BinaryToDecimal = () => <PairTool left="Binary" right="Decimal" convert={s=>s?convertBase(s,2,10):''} sample="101010" />;
export const HexToDecimal = () => <PairTool left="HEX" right="Decimal" convert={s=>s?convertBase(s,16,10):''} sample="FF" />;
export const DecimalToHex = () => <PairTool left="Decimal" right="HEX" convert={s=>s?convertBase(s,10,16).toUpperCase():''} sample="255" />;
export const OctalToDecimal = () => <PairTool left="Octal" right="Decimal" convert={s=>s?convertBase(s,8,10):''} sample="777" />;
export const DecimalToOctal = () => <PairTool left="Decimal" right="Octal" convert={s=>s?convertBase(s,10,8):''} sample="511" />;
export const HexToBinary = () => <PairTool left="HEX" right="Binary" convert={s=>s?convertBase(s,16,2):''} sample="FF" />;
export const BinaryToHex = () => <PairTool left="Binary" right="HEX" convert={s=>s?convertBase(s,2,16).toUpperCase():''} sample="11111111" />;
export const OctalToBinary = () => <PairTool left="Octal" right="Binary" convert={s=>s?convertBase(s,8,2):''} />;
export const BinaryToOctal = () => <PairTool left="Binary" right="Octal" convert={s=>s?convertBase(s,2,8):''} />;
export const HexToOctal = () => <PairTool left="HEX" right="Octal" convert={s=>s?convertBase(s,16,8):''} />;
export const OctalToHex = () => <PairTool left="Octal" right="HEX" convert={s=>s?convertBase(s,8,16).toUpperCase():''} />;
