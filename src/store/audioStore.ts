import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  audioElement: HTMLAudioElement | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setAudioElement: (audioElement: HTMLAudioElement) => void;
  togglePlay: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  audioElement: null,
  
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setVolume: (volume) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = volume;
    }
    set({ volume });
  },
  
  setProgress: (progress) => set({ progress }),
  
  setDuration: (duration) => set({ duration }),
  
  setAudioElement: (audioElement) => {
    audioElement.volume = get().volume;
    set({ audioElement });
  },
  
  togglePlay: () => {
    const { isPlaying, audioElement } = get();
    
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      
      set({ isPlaying: !isPlaying });
    }
  },
}));