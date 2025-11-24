import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AppTab, CreateVideoState, VideoStyle, AspectRatio, Resolution } from '../types';
import { Button } from '../components/Button';

// Steps
import ContentStep from './steps/ContentStep';
import StyleStep from './steps/StyleStep';
import SettingsStep from './steps/SettingsStep';
import PreviewStep from './steps/PreviewStep';
import { generateVideo } from '../services/geminiService';

interface CreateVideoProps {
  onNavigate: (tab: AppTab) => void;
}

const CreateVideoView: React.FC<CreateVideoProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Form State
  const [state, setState] = useState<CreateVideoState>({
    prompt: '',
    enhancedPrompt: '',
    style: VideoStyle.Cinematic3D,
    aspectRatio: AspectRatio.Landscape,
    resolution: Resolution.HD,
    duration: 5,
  });

  const updateState = (updates: Partial<CreateVideoState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onNavigate(AppTab.Home);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Use enhanced prompt if available, else original
      const finalPrompt = state.enhancedPrompt || state.prompt;
      
      const url = await generateVideo(
        finalPrompt,
        state.style,
        state.aspectRatio,
        state.resolution,
        state.imageFile
      );
      
      setVideoUrl(url);
      setStep(4); // Move to Preview
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Failed to generate video. Please ensure you have a valid API Key selected with Veo access.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen md:h-auto md:min-h-screen">
      {/* Step Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="text-slate-500 hover:text-slate-900 flex items-center text-sm font-medium">
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
            <span className="text-sm font-semibold text-slate-900">
               {step === 4 ? "Done!" : `Step ${step} of 3`}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-slate-100 relative">
                 <div 
                   className={`absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-500 ${step >= s ? 'w-full' : 'w-0'}`}
                 />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium uppercase tracking-wide">
             <span className={step >= 1 ? 'text-indigo-600' : ''}>Content</span>
             <span className={step >= 2 ? 'text-indigo-600' : ''}>Style</span>
             <span className={step >= 3 ? 'text-indigo-600' : ''}>Settings</span>
             <span className={step >= 4 ? 'text-indigo-600' : ''}>Preview</span>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {loading ? (
             <div className="flex flex-col items-center justify-center h-96 text-center space-y-6 animate-in fade-in">
                 <div className="relative">
                   <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600">AI</div>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Creating your video magic...</h3>
                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">This may take up to a minute. Veo is rendering frames for "{state.style}" style.</p>
                 </div>
             </div>
          ) : (
            <>
              {step === 1 && <ContentStep state={state} updateState={updateState} onNext={handleNext} />}
              {step === 2 && <StyleStep state={state} updateState={updateState} onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <SettingsStep state={state} updateState={updateState} onGenerate={handleGenerate} onBack={handleBack} />}
              {step === 4 && <PreviewStep videoUrl={videoUrl} onBack={() => onNavigate(AppTab.Projects)} />}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateVideoView;