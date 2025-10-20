import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Palette, Globe, Lightbulb } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const About: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { t } = useTranslation();

  const skills = [
    { 
      icon: <Code className="w-6 h-6" />, 
      title: t('development'), 
      description: t('developmentDesc')
    },
    { 
      icon: <Palette className="w-6 h-6" />, 
      title: t('design'), 
      description: t('designDesc')
    },
    { 
      icon: <Globe className="w-6 h-6" />, 
      title: t('deployment'), 
      description: t('deploymentDesc')
    },
    { 
      icon: <Lightbulb className="w-6 h-6" />, 
      title: t('innovation'), 
      description: t('innovationDesc')
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  
  return (
    <section id="about" className="relative w-full py-20 bg-surface" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
      
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t('aboutMe')}</h2>
            <p className="mb-6 text-gray-300">
              {t('aboutDescription1')}
            </p>
            <p className="mb-6 text-gray-300">
              {t('aboutDescription2')}
            </p>
            <p className="text-gray-400">
              {t('aboutDescription3')}
            </p>
            
            <div className="mt-8">
              <a href="#contact" className="btn-primary">
                {t('getInTouch')}
              </a>
            </div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 transition-colors border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-400/10 text-primary-400">
                  {skill.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{skill.title}</h3>
                <p className="text-gray-400">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
