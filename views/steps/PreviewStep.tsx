import React from 'react';
import { Download, Share2, CheckCircle } from 'lucide-react';
import { Button } from '../../components/Button';

interface Props {
  videoUrl: string | null;
  onBack: () => void;
}

const PreviewStep: React.FC<Props> = ({ videoUrl, onBack }) => {
  return (
    <div className="text-center animate-in zoom-in-95 duration-500">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <CheckCircle size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Your video is ready!</h2>
        <p className="text-slate-500 mt-2">Check out the preview below.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl mb-8 border-4 border-slate-100">
        {videoUrl ? (
            <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-auto max-h-[60vh] mx-auto"
            />
        ) : (
            <div className="h-64 flex items-center justify-center text-white">Video failed to load</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {videoUrl && (
            <a href={videoUrl} download="my-video.mp4" className="inline-block">
                <Button rightIcon={<Download size={18}/>} className="w-full sm:w-auto px-8 py-3 text-lg">
                    Download Video
                </Button>
            </a>
        )}
        <Button variant="outline" rightIcon={<Share2 size={18}/>}>
            Share Link
        </Button>
      </div>
      
      <div className="mt-8">
        <button onClick={onBack} className="text-slate-500 hover:text-indigo-600 font-medium text-sm">
            Save to Projects & Return Home
        </button>
      </div>
    </div>
  );
};

export default PreviewStep;