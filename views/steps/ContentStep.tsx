import React, { useState, useRef } from 'react';
import { Wand2, Mic, Image as ImageIcon, FileAudio, Sparkles, type LucideIcon } from 'lucide-react';
import { CreateVideoState } from '../../types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { enhanceTextPrompt, transcribeAudio } from '../../services/geminiService';

interface Props {
  state: CreateVideoState;
  updateState: (updates: Partial<CreateVideoState>) => void;
  onNext: () => void;
}

const enhanceOptions = [
  { label: 'Fix Clarity', prompt: 'Improve clarity and grammar' },
  { label: 'Make Catchy', prompt: 'Make it short, punchy, and catchy' },
  { label: 'Story Mode', prompt: 'Convert into a compelling narrative story' },
  { label: 'Explanation', prompt: 'Explain it simply for beginners' },
];

const tones = ['Professional', 'Friendly', 'Fun', 'Emotional', 'Dramatic'];

const ContentStep: React.FC<Props> = ({ state, updateState, onNext }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleEnhance = async (instruction: string) => {
    if (!state.prompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceTextPrompt(state.prompt, instruction);
      updateState({ enhancedPrompt: enhanced });
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateState({ audioFile: file });
    }
  };

  const handleTranscribe = async () => {
    if (!state.audioFile) return;
    setIsTranscribing(true);
    try {
      const text = await transcribeAudio(state.audioFile);
      updateState({ prompt: text });
    } catch (e) {
      alert("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateState({ imageFile: file });
    }
  };

  const currentText = state.enhancedPrompt || state.prompt;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-10">
      <div className="text-center md:text-left">
         <h2 className="text-2xl font-bold text-slate-900">Start with your idea</h2>
         <p className="text-slate-500 mt-1">Provide a script, upload audio, or use an image reference.</p>
      </div>

      {/* Text Input Section */}
      <Card className="p-1 border-indigo-100 shadow-lg bg-white overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
           <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
             Script / Prompt
           </label>
           <span className="text-xs text-slate-400">{currentText.length} chars</span>
        </div>
        
        <textarea
          className="w-full p-5 text-slate-800 bg-white min-h-[160px] resize-none focus:outline-none text-lg leading-relaxed placeholder:text-slate-300"
          placeholder="e.g. A futuristic city with flying cars at sunset, cinematic lighting..."
          value={currentText}
          onChange={(e) => updateState({ prompt: e.target.value, enhancedPrompt: '' })}
        />
        
        {/* AI Enhancement Toolbar */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-3">
            
            {/* Goals */}
            <div className="flex flex-wrap items-center gap-2">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center mr-1">
                 <Wand2 size={12} className="mr-1"/> Enhance:
               </span>
               {enhanceOptions.map((opt) => (
                  <button
                     key={opt.label}
                     onClick={() => handleEnhance(opt.prompt)}
                     disabled={isEnhancing || !state.prompt}
                     className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all disabled:opacity-50"
                  >
                     {opt.label}
                  </button>
               ))}
            </div>

            {/* Tones */}
            <div className="flex flex-wrap items-center gap-2">
               <span className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center mr-1">
                 <Sparkles size={12} className="mr-1"/> Tone:
               </span>
               {tones.map((tone) => (
                  <button
                     key={tone}
                     onClick={() => handleEnhance(`Make the tone ${tone}`)}
                     disabled={isEnhancing || !state.prompt}
                     className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:shadow-sm transition-all disabled:opacity-50"
                  >
                     {tone}
                  </button>
               ))}
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio Input */}
        <Card className={`p-6 border-2 border-dashed transition-all ${state.audioFile ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'}`}>
            <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${state.audioFile ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {state.audioFile ? <FileAudio size={28}/> : <Mic size={28}/>}
                </div>
                
                <h3 className="font-semibold text-slate-900">
                    {state.audioFile ? state.audioFile.name : "Add Audio (Optional)"}
                </h3>
                
                {!state.audioFile && (
                   <p className="text-xs text-slate-500 mt-2 mb-4">Upload voiceover or narration (MP3/WAV)</p>
                )}

                <input 
                    type="file" 
                    ref={audioInputRef} 
                    className="hidden" 
                    accept="audio/*" 
                    onChange={handleAudioUpload} 
                />
                
                <div className="flex gap-2 mt-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => audioInputRef.current?.click()}
                    >
                        {state.audioFile ? "Replace" : "Upload Audio"}
                    </Button>
                    
                    {state.audioFile && (
                       <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={handleTranscribe}
                          isLoading={isTranscribing}
                       >
                          Transcribe
                       </Button>
                    )}
                </div>
                {state.audioFile && !isTranscribing && (
                   <p className="text-[10px] text-indigo-600 mt-2 font-medium">Click Transcribe to use this audio as your script source.</p>
                )}
            </div>
        </Card>

        {/* Image Input */}
        <Card className={`p-6 border-2 border-dashed transition-all ${state.imageFile ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'}`}>
            <div className="flex flex-col items-center text-center">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${state.imageFile ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                    <ImageIcon size={28}/>
                </div>

                <h3 className="font-semibold text-slate-900">
                    {state.imageFile ? "Image Added" : "Start from Image (Optional)"}
                </h3>

                {state.imageFile ? (
                    <div className="my-4 h-24 w-full rounded-lg overflow-hidden border border-slate-200 relative group">
                        <img src={URL.createObjectURL(state.imageFile)} className="w-full h-full object-cover" alt="Preview"/>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500 mt-2 mb-4">Use an image as the first frame of your video</p>
                )}

                <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                />
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => imageInputRef.current?.click()}
                >
                    {state.imageFile ? "Change Image" : "Upload Image"}
                </Button>
            </div>
        </Card>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
            onClick={onNext} 
            disabled={!state.prompt && !state.audioFile && !state.imageFile}
            className="w-full md:w-auto px-8"
            rightIcon={<span className="ml-1">→</span>}
        >
            Next: Choose Style
        </Button>
      </div>
    </div>
  );
};

export default ContentStep;
