import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

import facImage from '../../assets/img/fac.png';

const Avatar: React.FC = () => {
  const avatarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = avatar.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = (e.clientX - centerX) / (width / 2);
      const deltaY = (e.clientY - centerY) / (height / 2);
      
      // Limit rotation to a certain range
      const rotateX = Math.min(Math.max(-deltaY * 10, -10), 10);
      const rotateY = Math.min(Math.max(deltaX * 10, -10), 10);
      
      avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      avatar.style.transition = 'transform 0.5s ease';
    };
    
    const handleMouseEnter = () => {
      avatar.style.transition = 'transform 0.1s ease';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    avatar.addEventListener('mouseleave', handleMouseLeave);
    avatar.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (avatar) {
        avatar.removeEventListener('mouseleave', handleMouseLeave);
        avatar.removeEventListener('mouseenter', handleMouseEnter);
      }
    };
  }, []);
  
  return (
    <motion.div 
      ref={avatarRef}
      className="relative w-72 h-72 md:w-96 md:h-96 animate-float"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 opacity-20 blur-xl animate-pulse-slow"></div>
      <div className="relative w-full h-full overflow-hidden rounded-full border-2 border-gray-700 p-1">
        <img 
          src={facImage}
          alt="Avatar" 
          className="w-full h-full object-cover rounded-full"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400/10 to-secondary-400/10"></div>
        <div className="absolute inset-0 rounded-full border border-white/10"></div>
      </div>
      
      {/* Orbit decoration */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-700 animate-spin-slow"></div>
      
      {/* Glow spots */}
      <div className="absolute top-1/4 right-0 w-4 h-4 rounded-full bg-primary-400 blur-sm"></div>
      <div className="absolute bottom-1/4 left-0 w-3 h-3 rounded-full bg-secondary-400 blur-sm"></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-accent-400 blur-sm"></div>
    </motion.div>
  );
};

export default Avatar;