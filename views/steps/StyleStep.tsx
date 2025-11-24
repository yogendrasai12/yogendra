import React from 'react';
import { CreateVideoState, VideoStyle } from '../../types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Film, Video, Palette, Sparkles, Monitor, PenTool, Clapperboard, Ghost, Presentation } from 'lucide-react';

interface Props {
  state: CreateVideoState;
  updateState: (updates: Partial<CreateVideoState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const styles = [
  { id: VideoStyle.Cinematic3D, label: 'Cinematic 3D', desc: 'Epic lighting, depth, and movie-like quality', icon: <Film size={28} /> },
  { id: VideoStyle.Animation, label: '3D Animation', desc: 'Playful characters & vibrant colors (Pixar style)', icon: <Ghost size={28} /> },
  { id: VideoStyle.Realistic, label: 'Realistic', desc: 'Photorealistic footage and natural movement', icon: <Video size={28} /> },
  { id: VideoStyle.Emoji, label: 'Emoji Story', desc: 'Fun, social-media style with icons', icon: <Sparkles size={28} /> },
  { id: VideoStyle.Minimal, label: 'Minimal Slides', desc: 'Clean typography and smooth transitions', icon: <Presentation size={28} /> },
  { id: VideoStyle.Whiteboard, label: 'Whiteboard', desc: 'Hand-drawn sketches for explanation', icon: <PenTool size={28} /> },
];

const StyleStep: React.FC<Props> = ({ state, updateState, onNext, onBack }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-10">
       <div className="text-center md:text-left">
         <h2 className="text-2xl font-bold text-slate-900">Choose your vibe</h2>
         <p className="text-slate-500 mt-1">Select a visual style that matches your content.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {styles.map((style) => {
          const isSelected = state.style === style.id;
          return (
            <Card 
              key={style.id}
              selected={isSelected}
              onClick={() => updateState({ style: style.id })}
              className={`
                 relative p-6 flex flex-col items-start text-left h-full transition-all duration-300
                 ${isSelected ? 'bg-indigo-50/50 scale-[1.02]' : 'hover:border-indigo-200 hover:bg-slate-50'}
              `}
            >
              <div className={`
                 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all
                 ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500'}
              `}>
                  {style.icon}
              </div>
              <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{style.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
              
              {isSelected && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-slate-800">Back</Button>
        <Button onClick={onNext} className="px-8" rightIcon={<span className="ml-1">→</span>}>Next: Settings</Button>
      </div>
    </div>
  );
};

export default StyleStep;
