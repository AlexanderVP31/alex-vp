import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Avatar from './ui/Avatar';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const elements = containerRef.current.querySelectorAll('.parallax');
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;
      
      elements.forEach((el) => {
        const speedX = parseFloat(el.getAttribute('data-speed-x') || '0');
        const speedY = parseFloat(el.getAttribute('data-speed-y') || '0');
        const translateX = deltaX * speedX;
        const translateY = deltaY * speedY;
        
        (el as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      ref={containerRef}
    >
      {/* Background elements */}
      <div className="absolute inset-0 animated-background opacity-60 z-0"></div>
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl parallax" data-speed-x="-20" data-speed-y="-10"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl parallax" data-speed-x="25" data-speed-y="15"></div>
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-accent-400/20 rounded-full blur-3xl parallax" data-speed-x="-15" data-speed-y="20"></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="#">
                <img
                  src="/src/assets/logo/iconsinfondo.png"
                  alt="Logo"
                  className="w-15 h-15"
                  loading="lazy"
                />
              </a>
              <span className="block">{t('presentacion') || 'Portfolio'}</span>
              <span className="gradient-text">Alex.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {t('heroSubtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <a href="#projects" className="btn-primary">
                {t('viewProjects')}
              </a>
              <a href="#contact" className="btn-outline">
                {t('contactMe')}
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 flex justify-center items-center parallax" 
            data-speed-x="10" 
            data-speed-y="10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Avatar />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-8 h-8 text-gray-300" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;