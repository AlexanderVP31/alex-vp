import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Volume1, VolumeX, Minimize2, Music } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import { useTranslation } from '../hooks/useTranslation';

const MusicPlayer: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progressInterval, setProgressInterval] = useState<number | null>(null);
  const { t } = useTranslation();
  
  const { 
    isPlaying, 
    volume, 
    progress, 
    duration,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    setAudioElement,
    togglePlay 
  } = useAudioStore();
  
  // Set up audio
  useEffect(() => {
    // Sample boom bap track URL - replace with your actual audio file
    const audioSrc = 'https://elements-web-assets.s3.us-west-2.amazonaws.com/Music+Kits/ATMOS/ATMOS_Beats_Smooth_Mind_2.wav';
    
    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audio.volume = volume;
      audio.preload = 'metadata';
      
      audioRef.current = audio;
      setAudioElement(audio);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('play', () => {
        setIsPlaying(true);
      });
      
      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      
      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime);
      });
      
      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [setAudioElement, setDuration, setIsPlaying, setProgress, volume]);
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
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
  
  return (
    <AnimatePresence>
      {expanded ? (
        <motion.div 
          className="fixed bottom-4 right-4 z-40 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-800 w-72 overflow-hidden"
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 20, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Music className="w-5 h-5 text-primary-400 mr-2" />
                <h3 className="font-medium">{t('nowPlaying')}</h3>
              </div>
              <button 
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center mr-3 overflow-hidden">
                <div className={`w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 ${isPlaying ? 'animate-pulse-slow' : ''}`}></div>
              </div>
              <div>
                <h4 className="font-medium">Boom Bap Beat</h4>
                <p className="text-sm text-gray-400">{t('backgroundMusic')}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <input 
                type="range"
                min="0"
                max={duration || 100}
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-1 w-1/3">
                <button className="text-gray-400 hover:text-white transition-colors">
                  {getVolumeIcon()}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-400"
                />
              </div>
              
              <button 
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-primary-400 hover:bg-primary-500 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              
              <div className="w-1/3"></div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button 
          className={`fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-primary-400 text-white shadow-glow' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          onClick={() => setExpanded(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Music className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;