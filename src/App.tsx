import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/ui/CustomCursor';
import MusicPlayer from './components/MusicPlayer';
import NoiseTexture from './components/ui/NoiseTexture';
import TechStack from './components/TechStack';

function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full min-h-screen"
      >
        <CustomCursor />
        <NoiseTexture />
        <Navbar />
        <MusicPlayer />
        
        <main>
          <Hero />
          <Projects />
          <About />
          <Contact />
          <TechStack />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default App;