import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import { useAudioStore } from '../../store/audioStore';

// Isolated component that only subscribes to isPlaying and togglePlay
// This prevents the Navbar from re-rendering when other audio state changes
const MusicButton: React.FC = () => {
  // Use selectors to only subscribe to the specific state we need
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);

  return (
    <motion.button
      className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-surface hover:bg-gray-800"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      <Music className={`w-5 h-5 ${isPlaying ? 'text-primary-400' : 'text-gray-300'}`} />
    </motion.button>
  );
};

export default MusicButton;
