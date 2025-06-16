import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    { title: t('home'), href: '#hero' },
    { title: t('projects'), href: '#projects' },
    { title: t('about'), href: '#about' },
    { title: t('contact'), href: '#contact' },
  ];

  return (
    <footer className="py-10 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="border-t border-gray-800 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                  <img 
                    src="/src/assets/logo/iconsinfondo.png" 
                    alt="Icon"
                    className="w-12 h-12" // Tamaño pequeño del logo
                  />
                  <motion.a 
                    href="#" 
                    className="text-2xl font-bold gradient-text inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    AVP
                  </motion.a>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {t('footerDescription')}
              </p>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('contactTitle')}</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">
                  <span className="block text-gray-500">{t('correo')}</span>
                  <a href="mailto:alex_3120@hotmail.com" className="hover:text-primary-400 transition-colors">
                    alex_3120@hotmail.com
                  </a>
                </li>
                <li className="text-gray-400">
                  <span className="block text-gray-500">{t('telefono')}</span>
                  <a href="tel:+11234567890" className="hover:text-primary-400 transition-colors">
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
          
          <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {t('designedWith')} <Heart className="w-4 h-4 inline text-primary-400 mx-1" /> in 2025
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                {t('termsOfService')}
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
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