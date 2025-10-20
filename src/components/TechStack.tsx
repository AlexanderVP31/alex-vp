import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

const TechStack: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { t } = useTranslation();

  const frontendTechs = [
    { name: 'Angular', icon: 'https://skillicons.dev/icons?i=angular' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Vite', icon: 'https://vitejs.dev/logo.svg' },
    { name: 'Sass', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
  ];

  const backendTechs = [
    { name: 'Java', icon: 'https://skillicons.dev/icons?i=java' },
    { name: 'Spring', icon: 'https://skillicons.dev/icons?i=spring' },
    { name: '.Net', icon: 'https://skillicons.dev/icons?i=dotnet' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  ];

  const TechBubble = ({ tech, index, direction }: { tech: { name: string; icon: string }; index: number; direction: 'left' | 'right' }) => (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: direction === 'left' ? -50 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 tech-bubble group"
      whileHover={{ scale: 1.1, y: -5 }}
    >
      <div className="flex items-center justify-center w-16 h-16 p-3 transition-all duration-300 border border-gray-700 rounded-full md:w-20 md:h-20 bg-gray-800/50 group-hover:border-primary-400 group-hover:shadow-glow group-hover:bg-gray-700/50">
        <img 
          src={tech.icon} 
          alt={tech.name}
          className="object-contain w-full h-full transition-all duration-300 filter brightness-90 group-hover:brightness-110"
          onError={(e) => {
            // Fallback en caso de que la imagen no cargue
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = `<span class="text-xs font-medium text-gray-300">${tech.name}</span>`;
          }}
        />
      </div>
      <span className="mt-2 text-xs font-medium text-center text-gray-400 transition-colors duration-300 group-hover:text-primary-400">
        {tech.name}
      </span>
    </motion.div>
  );

  const ScrollingRow = ({ techs, direction, speed }: { techs: typeof frontendTechs; direction: 'left' | 'right'; speed: string }) => (
    <div className="relative w-full overflow-hidden">
      <div className={`flex gap-8 ${speed} ${direction === 'right' ? 'scroll-right' : 'scroll-left'}`}>
        {/* Duplicamos las tecnologías múltiples veces para crear un scroll infinito perfecto */}
        {[...techs, ...techs, ...techs, ...techs].map((tech, index) => (
          <TechBubble 
            key={`${tech.name}-${index}`} 
            tech={tech} 
            index={index % techs.length} 
            direction={direction}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-surface to-background" ref={ref}>
      <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-primary-400/5 to-secondary-400/5"></div>
      
      <div className="container relative z-10 px-4 mx-auto md:px-6">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('techStack')}</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            {t('techStackDescription')}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Frontend Row */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-8 text-2xl font-semibold gradient-text">{t('frontend')}</h3>
            <ScrollingRow techs={frontendTechs} direction="left" speed="slow" />
          </motion.div>

          {/* Backend Row */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-8 text-2xl font-semibold gradient-text">{t('backend')}</h3>
            <ScrollingRow techs={backendTechs} direction="right" speed="medium" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;