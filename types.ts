export enum AppTab {
  Home = 'home',
  Create = 'create',
  Templates = 'templates',
  Projects = 'projects',
  Profile = 'profile'
}

export enum VideoStyle {
  Cinematic3D = 'Cinematic 3D',
  Animation = '3D Animation',
  Realistic = 'Realistic',
  Emoji = 'Emoji Story',
  Minimal = 'Minimal Slides',
  Whiteboard = 'Whiteboard'
}

export enum AspectRatio {
  Landscape = '16:9',
  Portrait = '9:16',
  Square = '1:1',
  Vertical = '4:5'
}

export enum Resolution {
  HD = '720p',
  FullHD = '1080p',
  UltraHD = '4K'
}

export interface VideoProject {
  id: string;
  title: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  style: VideoStyle;
  aspectRatio: AspectRatio;
}

export interface CreateVideoState {
  prompt: string;
  enhancedPrompt: string;
  audioFile?: File;
  imageFile?: File; 
  style: VideoStyle;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  duration: number; 
}

// Extend Window interface for AI Studio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}