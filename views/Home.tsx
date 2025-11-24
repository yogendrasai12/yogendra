import React from 'react';
import { Plus, Layout, PlayCircle, ArrowRight } from 'lucide-react';
import { AppTab } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface HomeProps {
  onNavigate: (tab: AppTab) => void;
}

const HomeView: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Create magic with Veo
        </h1>
        <p className="text-slate-500 text-lg">
          Turn your text, audio, and images into stunning videos in seconds.
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card 
          className="p-8 hover:border-indigo-400 group relative overflow-hidden"
          onClick={() => onNavigate(AppTab.Create)}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Plus size={120} className="text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Video</h2>
            <p className="text-slate-500 mb-6">Start from a text script, audio recording, or upload images.</p>
            <Button rightIcon={<ArrowRight size={16} />}>
              Start Creating
            </Button>
          </div>
        </Card>

        <Card 
          className="p-8 hover:border-teal-400 group relative overflow-hidden"
          onClick={() => onNavigate(AppTab.Templates)}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Layout size={120} className="text-teal-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
              <Layout size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Browse Templates</h2>
            <p className="text-slate-500 mb-6">Pick a ready-made style for Reels, YouTube, or Ads.</p>
            <Button variant="secondary" rightIcon={<ArrowRight size={16} />}>
              View Templates
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Projects Preview */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-900">Recent Projects</h3>
        <button 
          onClick={() => onNavigate(AppTab.Projects)}
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="group cursor-pointer overflow-hidden aspect-video relative">
            <img 
              src={`https://picsum.photos/400/225?random=${i}`} 
              alt="Thumbnail" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="text-white w-12 h-12" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-sm font-medium truncate">Project Draft {i}</p>
              <p className="text-white/70 text-xs">Edited 2 hours ago</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomeView;