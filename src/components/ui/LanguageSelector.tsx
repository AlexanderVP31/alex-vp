import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguageStore, languages, Language } from '../../store/languageStore';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = ''
}) => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-50 w-[100px] text-gray-300 hover:border-primary-400 transition-colors"
      >
        <span className="flex items-center gap-1 pointer-events-none">
          <span>{currentLanguage.flag}</span>
          <span className="text-xs font-medium">{currentLanguage.code.toUpperCase()}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-full min-w-[140px] z-50 rounded-md border border-gray-600 bg-gray-800 shadow-lg"
            role="listbox"
          >
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                    currentLanguage.code === language.code
                      ? 'bg-primary-400/10 text-primary-400'
                      : 'text-gray-300'
                  }`}
                >
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                  {currentLanguage.code === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-primary-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;