import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

import LogoSinFondo from '../assets/logo/iconsinfondo.png';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    { title: t('home'), href: '#hero' },
    { title: t('projects'), href: '#projects' },
    { title: t('about'), href: '#about' },
    { title: t('contact'), href: '#contact' },
  ];

  return (
    <footer className="relative w-full py-10 bg-background">
      <div className="absolute inset-0 opacity-50 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      <div className="container relative z-10 px-4 mx-auto md:px-6">
        <div className="pt-10 border-t border-gray-800">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4 space-x-2">
                  <img 
                    src={LogoSinFondo}
                    alt="Icon"
                    className="w-12 h-12" // Tamaño pequeño del logo
                  />
                  <motion.a 
                    href="#" 
                    className="inline-block text-2xl font-bold gradient-text"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    AVP
                  </motion.a>
              </div>
              <p className="max-w-md mb-6 text-gray-400">
                {t('footerDescription')}
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold">{t('quickLinks')}</h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 transition-colors hover:text-primary-400"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold">{t('contactTitle')}</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">
                  <span className="block text-gray-500">{t('correo')}</span>
                  <a href="mailto:alex_3120@hotmail.com" className="transition-colors hover:text-primary-400">
                    alex_3120@hotmail.com
                  </a>
                </li>
                <li className="text-gray-400">
                  <span className="block text-gray-500">{t('telefono')}</span>
                  <a href="tel:+11234567890" className="transition-colors hover:text-primary-400">
                    (+51) 912285221
                  </a>
                </li>
                <li className="text-gray-400">
                  <span className="block text-gray-500">{t('direccion')}</span>
                  Lima, LM
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-between pt-6 mt-10 border-t border-gray-800 md:flex-row">
            <p className="mb-4 text-sm text-gray-500 md:mb-0">
              {t('designedWith')} <Heart className="inline w-4 h-4 mx-1 text-primary-400" /> in 2025
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 transition-colors hover:text-primary-400">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-primary-400">
                {t('termsOfService')}
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-primary-400">
                {t('sitemap')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;