import { create } from 'zustand';
import { audioTracks, AudioTrack, getTrackById, getTrackIndex } from '../config/audioTracks';

interface AudioState {
  // Playback state
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  
  // Playlist state
  currentTrack: AudioTrack | null;
  playlist: AudioTrack[];
  currentTrackIndex: number;
  isShuffled: boolean;
  isLooping: boolean; // loop one track
  isPlaylistLooping: boolean; // loop entire playlist
  
  // Audio element reference
  audioElement: HTMLAudioElement | null;
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setAudioElement: (audioElement: HTMLAudioElement) => void;
  togglePlay: () => void;
  
  // Playlist actions
  playTrack: (trackId: string) => void;
  playTrackByIndex: (index: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  togglePlaylistLoop: () => void;
  play: () => void;
  pause: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial state
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  currentTrack: audioTracks[0] || null,
  playlist: audioTracks,
  currentTrackIndex: 0,
  isShuffled: false,
  isLooping: false,
  isPlaylistLooping: true,
  audioElement: null,
  
  // Basic setters
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  
  setVolume: (volume) => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.volume = Math.max(0, Math.min(1, volume));
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
        set({ isPlaying: false });
      } else {
        audioElement.play().then(() => {
          set({ isPlaying: true });
        }).catch((error) => {
          console.error('Play error:', error);
          set({ isPlaying: false });
        });
      }
    }
  },
  
  play: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.play().then(() => {
        set({ isPlaying: true });
      }).catch((error) => {
        console.error('Play error:', error);
        set({ isPlaying: false });
      });
    }
  },
  
  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
    }
  },
  
  // Playlist actions
  playTrack: (trackId: string) => {
    const track = getTrackById(trackId);
    if (track) {
      const { audioElement, volume } = get();
      
      if (audioElement) {
        audioElement.src = track.src;
        audioElement.load();
        audioElement.volume = volume;
        audioElement.play();
      }
      
      const trackIndex = getTrackIndex(trackId);
      set({ 
        currentTrack: track, 
        currentTrackIndex: trackIndex,
        isPlaying: true,
        progress: 0 
      });
    }
  },
  
  playTrackByIndex: (index: number) => {
    const { playlist } = get();
    if (index >= 0 && index < playlist.length) {
      const track = playlist[index];
      const { audioElement, volume } = get();
      
      if (audioElement) {
        audioElement.src = track.src;
        audioElement.load();
        audioElement.volume = volume;
        audioElement.play();
      }
      
      set({ 
        currentTrack: track, 
        currentTrackIndex: index,
        isPlaying: true,
        progress: 0 
      });
    }
  },
  
  nextTrack: () => {
    const { playlist, currentTrackIndex, isShuffled, isPlaylistLooping } = get();
    let nextIndex: number;
    
    if (isShuffled) {
      // Random track different from current
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (playlist.length > 1 && nextIndex === currentTrackIndex);
    } else {
      nextIndex = currentTrackIndex + 1;
      if (nextIndex >= playlist.length) {
        if (isPlaylistLooping) {
          nextIndex = 0;
        } else {
          // End of playlist
          const { audioElement } = get();
          if (audioElement) {
            audioElement.pause();
            set({ isPlaying: false });
          }
          return;
        }
      }
    }
    
    get().playTrackByIndex(nextIndex);
  },
  
  previousTrack: () => {
    const { playlist, currentTrackIndex, isPlaylistLooping, progress } = get();
    
    // If more than 3 seconds in, restart current track
    if (progress > 3) {
      const { audioElement } = get();
      if (audioElement) {
        audioElement.currentTime = 0;
        set({ progress: 0 });
      }
      return;
    }
    
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      if (isPlaylistLooping) {
        prevIndex = playlist.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    
    get().playTrackByIndex(prevIndex);
  },
  
  toggleShuffle: () => {
    const { isShuffled } = get();
    set({ isShuffled: !isShuffled });
  },
  
  toggleLoop: () => {
    const { isLooping, audioElement } = get();
    if (audioElement) {
      audioElement.loop = !isLooping;
    }
    set({ isLooping: !isLooping });
  },
  
  togglePlaylistLoop: () => {
    const { isPlaylistLooping } = get();
    set({ isPlaylistLooping: !isPlaylistLooping });
  },
}));
