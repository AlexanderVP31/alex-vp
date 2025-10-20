import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import Avatar from './ui/Avatar';

import LogoSinFondo from '../assets/logo/iconsinfondo.png';
import * as THREE from 'three';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // Logo animation with Framer Motion
  useEffect(() => {
    if (logoRef.current) {
      // Add continuous rotation animation
      logoRef.current.style.animation = 'spin 10s linear infinite';
    }
  }, []);

  // Three.js 3D logo setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(100, 100);

    const newScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Create a simple 3D cube as placeholder for 3D logo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    const cube = new THREE.Mesh(geometry, material);
    newScene.add(cube);


    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(newScene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center w-full min-h-screen pt-20 overflow-hidden"
      ref={containerRef}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 animated-background opacity-60"></div>
      
      <div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-primary-400/20 blur-3xl parallax" data-speed-x="-20" data-speed-y="-10"></div>
      <div className="absolute rounded-full bottom-1/3 right-1/4 w-80 h-80 bg-secondary-400/20 blur-3xl parallax" data-speed-x="25" data-speed-y="15"></div>
      <div className="absolute w-40 h-40 rounded-full top-1/2 right-1/3 bg-accent-400/20 blur-3xl parallax" data-speed-x="-15" data-speed-y="20"></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <motion.img
                  ref={logoRef}
                  src={LogoSinFondo}
                  alt="Logo"
                  className="inline-block w-15 h-15"
                  loading="lazy"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 pointer-events-none w-15 h-15 opacity-30"
                />
              </motion.a>
              <span className="block">{t('presentacion') || 'Portfolio'}</span>
              <span className="gradient-text">Alex.</span>
            </motion.h1>
            
            <motion.p 
              className="max-w-2xl mb-8 text-lg text-gray-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {t('heroSubtitle')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
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
            className="flex items-center justify-center flex-1 parallax" 
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
        className="absolute transform -translate-x-1/2 cursor-pointer bottom-10 left-1/2"
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