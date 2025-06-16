import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Music } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from './ui/LanguageSelector';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { togglePlay, isPlaying } = useAudioStore();
  const { t } = useTranslation();

  const navLinks = [
    { title: t('home'), href: '#hero' },
    { title: t('projects'), href: '#projects' },
    { title: t('about'), href: '#about' },
    { title: t('contact'), href: '#contact' },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Handle mobile menu item click
  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* Logo + AVP juntos */}
          <div className="flex items-center space-x-2">
            <a href="#">
              <img
                src="/src/assets/logo/iconsinfondo.png"
                alt="Logo"
                className="w-12 h-12"
                loading="lazy"
              />
            </a>
            <motion.a
              href="#"
              className="text-2xl font-bold gradient-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AVP
            </motion.a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.title}
              </a>
            ))}
            <LanguageSelector />
            <motion.button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <Music className={`w-5 h-5 ${isPlaying ? 'text-primary-400' : 'text-gray-300'}`} />
            </motion.button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <LanguageSelector className="scale-90" />
            <motion.button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              <Music className={`w-5 h-5 ${isPlaying ? 'text-primary-400' : 'text-gray-300'}`} />
            </motion.button>
            <motion.button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>


      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <span className="text-xl font-bold gradient-text">PORTFOLIO</span>
              <motion.button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-surface hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <nav className="flex flex-col space-y-4 p-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  className="text-2xl font-medium py-2 px-4 hover:bg-surface rounded-md transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNavClick(link.href);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.title}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;