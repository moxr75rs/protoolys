import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLang } from '../contexts/LanguageContext';
import { useToast } from '../hooks/use-toast';

export default function MockTool({ tool }) {
  const { t } = useLang();
  const { toast } = useToast();
  const [file, setFile] = React.useState(null);
  return (
    <div>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <Icons.Info className="w-4 h-4 shrink-0" />
        <span><b>{t('mock_title')}.</b> {t('mock_desc')}</span>
      </div>
      <div className="mt-6">
        <label className="block border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors">
          <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          <Icons.UploadCloud className="w-10 h-10 mx-auto text-indigo-500" />
          <p className="mt-3 font-semibold text-slate-700">{file ? file.name : `Drop your file here or click to ${t('upload').toLowerCase()}`}</p>
          <p className="mt-1 text-xs text-slate-500">All formats supported</p>
        </label>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => toast({ title: 'Demo mode', description: `${tool.name} is currently in preview. Full processing will be enabled once you connect this tool to the backend.` })} className="bg-indigo-600 hover:bg-indigo-700 text-white">{t('process')} <Icons.ArrowRight className="w-4 h-4 ml-1 flip-rtl" /></Button>
        </div>
      </div>
    </div>
  );
}
