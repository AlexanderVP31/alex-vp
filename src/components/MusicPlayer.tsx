import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Minimize2, 
  Music,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat1,
  ListMusic
} from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import { useTranslation } from '../hooks/useTranslation';
import { audioTracks } from '../config/audioTracks';

const MusicPlayer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextTrackRef = useRef<(() => void) | null>(null);
  const progressUpdateRef = useRef<number>(0);
  const { t } = useTranslation();
  
  const { 
    isPlaying, 
    volume, 
    progress, 
    duration,
    currentTrack,
    currentTrackIndex,
    isShuffled,
    isLooping,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setAudioElement,
    togglePlay,
    nextTrack,
    previousTrack,
    playTrackByIndex,
    toggleShuffle,
    toggleLoop,
  } = useAudioStore();

  // Keep nextTrack ref updated to avoid stale closures
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);
  
  // Initialize audio element - runs only once on mount
  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = isLooping;
    audio.volume = volume;
    audio.preload = 'metadata';
    
    audioRef.current = audio;
    setAudioElement(audio);
    
    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleTimeUpdate = () => {
      // Throttle progress updates to reduce re-renders (update every 250ms)
      const now = Date.now();
      if (now - progressUpdateRef.current >= 250) {
        progressUpdateRef.current = now;
        setProgress(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      const { isLooping: loopSingle } = useAudioStore.getState();
      setIsPlaying(false);
      
      if (loopSingle) {
        // Loop single track
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (nextTrackRef.current) {
        // Play next track using stable ref
        nextTrackRef.current();
      }
    };
    
    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
    };
    
    const handleWaiting = () => {
      setIsLoading(true);
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    
    // Load first track on mount
    if (currentTrack) {
      setIsLoading(true);
      audio.src = currentTrack.src;
      audio.load();
    }
    
    return () => {
      // Clean up event listeners
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      
      // Cleanup audio
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle currentTrack changes - separate effect for track switching
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    const audio = audioRef.current;
    const wasPlaying = !audio.paused;
    
    setIsLoading(true);
    audio.src = currentTrack.src;
    audio.load();
    
    // Restore playback state after loading
    if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentTrack?.id, currentTrack?.src, setIsLoading]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Update loop state when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);
  
  // Sync loop state with audio element on initial load
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  const formatTime = useCallback((time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };
  
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-4 h-4" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };
  
  const handleTrackClick = (index: number) => {
    playTrackByIndex(index);
    if (!expanded) {
      setExpanded(true);
    }
  };

  return (
    <AnimatePresence>
      {expanded ? (
        <motion.div 
          className="fixed z-40 overflow-hidden border border-gray-800 shadow-2xl bottom-4 right-4 bg-gray-900/95 backdrop-blur-md rounded-xl w-80 md:w-96"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Music className="w-5 h-5 mr-2 text-primary-400" />
                <h3 className="font-semibold text-white">{t('nowPlaying')}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    showPlaylist ? 'bg-primary-400 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  title={t('playlist')}
                >
                  <ListMusic className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setExpanded(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Playlist View */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-y-auto border-b border-gray-800 max-h-64"
              >
                <div className="p-2">
                  {audioTracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackClick(index)}
                      className={`w-full flex items-center p-2 rounded-lg transition-colors text-left ${
                        currentTrack?.id === track.id 
                          ? 'bg-primary-400/20 text-primary-400' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center mr-3 text-xs font-medium ${
                        currentTrack?.id === track.id 
                          ? 'bg-primary-400 text-white' 
                          : 'bg-gray-800 text-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${currentTrack?.id === track.id ? 'text-primary-400' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                      </div>
                      {currentTrack?.id === track.id && isPlaying && (
                        <div className="flex space-x-0.5">
                          <span className="w-1 h-3 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-4 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Player Content */}
          {!showPlaylist && (
            <>
              {/* Track Info */}
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${currentTrack?.coverColor || 'from-primary-400 to-secondary-400'} rounded-lg flex items-center justify-center mr-3 shadow-lg ${isPlaying ? 'animate-pulse-slow' : ''}`}>
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Music className="w-6 h-6 text-white/80" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {currentTrack?.title || t('backgroundMusic')}
                    </h4>
                    <p className="text-sm text-gray-400 truncate">
                      {currentTrack?.artist || t('backgroundMusic')}
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-400"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  {/* Volume */}
                  <div className="flex items-center w-24 space-x-1">
                    <button 
                      onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      {getVolumeIcon()}
                    </button>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-400"
                    />
                  </div>
                  
                  {/* Main Controls */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleShuffle}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isShuffled ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                      }`}
                      title={t('shuffle')}
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={previousTrack}
                      className="p-1 text-gray-400 transition-colors hover:text-white"
                      title={t('previous')}
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      disabled={isLoading}
                      className={`flex items-center justify-center w-12 h-12 transition-colors rounded-full shadow-lg ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-primary-400 hover:bg-primary-500 shadow-primary-400/30'}`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>
                    
                    <button 
                      onClick={nextTrack}
                      className="p-1 text-gray-400 transition-colors hover:text-white"
                      title={t('next')}
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={toggleLoop}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLooping ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                      }`}
                      title={t('repeatOne')}
                    >
                      <Repeat1 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Track Counter */}
                  <div className="flex justify-end w-24">
                    <span className="text-xs text-gray-500">
                      {currentTrackIndex + 1} {t('of')} {audioTracks.length}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      ) : (
        <motion.button 
          className={`fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-primary-400 text-white shadow-glow animate-pulse' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => setExpanded(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Music className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;
