import React from 'react';
import { CreateVideoState, AspectRatio, Resolution } from '../../types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { RectangleHorizontal, RectangleVertical, Square, Smartphone, MonitorPlay, Zap, Monitor } from 'lucide-react';

interface Props {
  state: CreateVideoState;
  updateState: (updates: Partial<CreateVideoState>) => void;
  onGenerate: () => void;
  onBack: () => void;
}

const SettingsStep: React.FC<Props> = ({ state, updateState, onGenerate, onBack }) => {
  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 pb-10">
       <div className="text-center md:text-left">
         <h2 className="text-2xl font-bold text-slate-900">Final touches</h2>
         <p className="text-slate-500 mt-1">Configure the format and quality of your video.</p>
      </div>

      {/* Aspect Ratio */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Aspect Ratio</h3>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded">Veo optimized</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RatioCard 
             label="Landscape" 
             sub="16:9 • YouTube" 
             icon={<RectangleHorizontal size={24} />} 
             selected={state.aspectRatio === AspectRatio.Landscape}
             onClick={() => updateState({ aspectRatio: AspectRatio.Landscape })}
          />
          <RatioCard 
             label="Portrait" 
             sub="9:16 • Reels/TikTok" 
             icon={<RectangleVertical size={24} />} 
             selected={state.aspectRatio === AspectRatio.Portrait}
             onClick={() => updateState({ aspectRatio: AspectRatio.Portrait })}
          />
          <RatioCard 
             label="Square" 
             sub="1:1 • Post" 
             icon={<Square size={24} />} 
             selected={state.aspectRatio === AspectRatio.Square}
             onClick={() => updateState({ aspectRatio: AspectRatio.Square })}
          />
          <RatioCard 
             label="Vertical" 
             sub="4:5 • Feed" 
             icon={<Smartphone size={24} />} 
             selected={state.aspectRatio === AspectRatio.Vertical}
             onClick={() => updateState({ aspectRatio: AspectRatio.Vertical })}
          />
        </div>
      </section>

      {/* Quality */}
      <section>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Resolution & Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <label className={`
               relative p-5 rounded-2xl border cursor-pointer flex items-start transition-all
               ${state.resolution === Resolution.HD ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-slate-300'}
           `}>
              <input 
                type="radio" 
                name="res" 
                className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                checked={state.resolution === Resolution.HD}
                onChange={() => updateState({ resolution: Resolution.HD })}
              />
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                     <span className="font-bold text-slate-900">Fast Preview (720p)</span>
                     <Zap size={16} className="text-amber-500 fill-amber-500" />
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed">Generated with Veo Fast. Quick generation (30-60s). Best for drafts and social media.</p>
              </div>
           </label>
           
           <label className={`
               relative p-5 rounded-2xl border cursor-pointer flex items-start transition-all
               ${state.resolution === Resolution.FullHD ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-slate-300'}
           `}>
              <input 
                type="radio" 
                name="res" 
                className="mt-1 mr-4 w-4 h-4 text-indigo-600 focus:ring-indigo-500" 
                checked={state.resolution === Resolution.FullHD}
                onChange={() => updateState({ resolution: Resolution.FullHD })}
              />
              <div className="flex-1">
                 <div className="flex items-center justify-between mb-1">
                     <span className="font-bold text-slate-900">High Quality (1080p)</span>
                     <Monitor size={16} className="text-indigo-500" />
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed">Generated with Veo. Slower generation but higher fidelity. Best for final content.</p>
              </div>
           </label>
        </div>
      </section>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex items-center shadow-lg shadow-indigo-200">
         <div className="bg-white/20 p-3 rounded-xl mr-4 backdrop-blur-sm">
             <MonitorPlay size={24} className="text-white" />
         </div>
         <div className="flex-1">
            <h4 className="font-bold text-sm uppercase tracking-wide opacity-90">Ready to Launch</h4>
            <p className="text-sm opacity-90 mt-1">
               Creating a <strong>{state.aspectRatio}</strong> video in <strong>{state.style}</strong> style.
            </p>
         </div>
         <Button onClick={onGenerate} className="bg-white text-indigo-600 hover:bg-white/90 border-0 shadow-none px-6">
            Generate Now
         </Button>
      </div>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-slate-800">Back to Style</Button>
      </div>
    </div>
  );
};

const RatioCard: React.FC<{ label: string, sub: string, icon: React.ReactNode, selected: boolean, onClick: () => void }> = ({ label, sub, icon, selected, onClick }) => (
    <Card 
        selected={selected} 
        onClick={onClick}
        className={`p-4 flex flex-col items-center justify-center text-center h-28 transition-all duration-200 ${selected ? 'bg-indigo-50/50' : ''}`}
    >
        <div className={`mb-3 ${selected ? 'text-indigo-600' : 'text-slate-400'}`}>
            {icon}
        </div>
        <div className="font-bold text-sm text-slate-900">{label}</div>
        <div className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</div>
    </Card>
);

export default SettingsStep;