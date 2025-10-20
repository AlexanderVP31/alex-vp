import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { ExternalLink, Github, ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import ReactDOM from 'react-dom';

// Importa tus assets de video aquí
import Proyectoemergencias from '../assets/video/Proyectoemergencias.mp4';
import AdminDashboards from '../assets/video/AdminDashboards.mp4';
import DocumentoDigitalVideo from '../assets/video/DocumentoDigital.mp4';
import SeguroVideo from '../assets/video/SeguroVideo.mp4';
import MowaVideo from '../assets/video/MowaVideo.mp4';
//import MowaVideo from 'https://www.youtube.com/watch?v=o03dByzxbXo';

//import AdminDashboards from '../assets/img/adminDashboards.jpg';

// Componente de Video con controles personalizados
const CustomVideoPlayer = ({ src, title, onFullscreen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Control de tiempo para ocultar controles automáticamente
  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    
    if (isPlaying && showControls) {
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isPlaying, showControls]);
  
  // Manejar play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowControls(true);
    }
  };
  
  // Manejar mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Actualizar progreso del video
  const updateProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };
  
  // Manejar clic en la barra de progreso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden group"
      ref={containerRef}
      onMouseEnter={() => {
        setIsHovering(true);
        setShowControls(true);
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        loop
        muted={isMuted}
        playsInline
        className="object-cover w-full h-full transition-transform duration-500"
        onClick={togglePlay}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
      
      {/* Controles personalizados */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Barra de progreso */}
        <div 
          className="w-full h-1 mb-3 bg-gray-600 rounded-full cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full rounded-full bg-primary-400"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Botones de control */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button 
              onClick={togglePlay}
              className="text-white transition-colors hover:text-primary-400"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button 
              onClick={toggleMute}
              className="text-white transition-colors hover:text-primary-400"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <div className="ml-2 text-sm text-white">
              {Math.floor(videoRef.current?.currentTime || 0)}s
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => onFullscreen(src, title)}
              className="text-white transition-colors hover:text-primary-400"
              aria-label="Pantalla completa"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Indicador de reproducción cuando los controles están ocultos */}
      {isHovering && !showControls && !isPlaying && (
        <div className="absolute flex items-center justify-center w-16 h-16 transition-opacity transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 top-1/2 left-1/2 bg-black/50 group-hover:opacity-100">
          <Play size={30} className="text-white opacity-70" />
        </div>
      )}
    </div>
  );
};

// Componente para pantalla completa usando Portal
const FullscreenVideoPortal = ({ src, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Crear elemento para el portal
  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;
  
  // Manejar tecla ESC para salir de pantalla completa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  // Iniciar reproducción automática al montar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error al reproducir el video:", error);
      });
      setIsPlaying(true);
    }
  }, []);
  
  // Actualizar progreso del video
  const updateProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };
  
  // Manejar play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error al reproducir el video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Manejar mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Manejar clic en la barra de progreso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black z-[1000] flex items-center justify-center p-4">
      <div className="absolute z-10 flex gap-4 top-6 right-6">
        <button 
          onClick={toggleMute}
          className="text-white transition-colors hover:text-primary-400"
          aria-label={isMuted ? "Activar sonido" : "Silenciar"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        
        <button 
          onClick={onClose}
          className="text-white transition-colors hover:text-primary-400"
          aria-label="Cerrar pantalla completa"
        >
          <X size={32} />
        </button>
      </div>
      
      <div className="relative w-full max-w-4xl overflow-hidden bg-black rounded-lg aspect-video">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="object-cover w-full h-full"
          onTimeUpdate={updateProgress}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
        >
          <source src={src} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
        
        {/* Botón de play/pause central */}
        <div 
          className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!isPlaying && (
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black/50">
              <Play size={40} className="text-white" />
            </div>
          )}
        </div>
        
        {/* Barra de progreso */}
        <div 
          ref={progressBarRef}
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
        >
          <div 
            className="w-full h-2 mb-3 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full rounded-full bg-primary-400"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium text-white">{title}</div>
            <div className="text-sm text-white">
              {Math.floor(videoRef.current?.currentTime || 0)}s / {Math.floor(videoRef.current?.duration || 0)}s
            </div>
          </div>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

// Componente de Imagen
const ImageDisplay = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-full overflow-hidden">
    <img 
      src={src} 
      alt={alt}
      className="object-cover w-full h-full transition-transform duration-500"
      onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/600x400/1a1a2e/ffffff?text=Imagen+no+disponible';
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
  </div>
);

// Componente principal de Proyectos
const Projects: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const swiperRef = useRef<any>(null);
  const { t } = useTranslation();
  const [fullscreenVideo, setFullscreenVideo] = useState<{src: string; title: string} | null>(null);

  const projects = [
    
    {
      id: 1,
      title: t('emergenciasPlatform'),
      description: t('emergenciasDesc'),
      video: Proyectoemergencias,
      tags: ['Angular','PrimeNG','Java','Spring Boot', 'Sql Server'],
      link: 'https://actours.com.pe/adminemergencias/login',
      github: 'https://github.com/avmkui/admin-emergencias.git',
    },
    {
      id: 1,
      title: t('adminDashboardsPlatform'),
      description: t('adminDashboardsDesc'),
      video: AdminDashboards,
      tags: ['Angular', 'Java','Spring Boot','Sql Server', 'Power BI Desktop'],
      link: 'https://actours.com.pe/acadmin/login',
      github: 'https://github.com/avmkui/admin_reportes',
    },
    {
      id: 2,
      title: t('provedorPlatform'),
      description: t('provedorDesc'),
      video: DocumentoDigitalVideo,
      tags: ['Angular','PrimeNG', 'Java','Spring Boot', 'Sql Server'],
      link: 'https://actours.com.pe/adminproveedor/login',
      github: 'https://github.com/avmkui/app_proveedor',
    },
    // {
    //   id: 3,
    //   title: t('oepromarPlatform'),
    //   description: t('oepromarDesc'),
    //   video: OePromartVideo,
    //   tags: ['Angular','PrimeNG', 'Java','Spring Boot', 'Sql Server'],
    //   link: 'https://actours.com.pe/adminproveedor/login',
    //   github: 'https://github.com/avmkui/app_proveedor',
    // },
    {
      id: 3,
      title: t('seguroPlatform'),
      description: t('seguroDesc'),
      video: SeguroVideo,
      tags: ['Angular','Bootstrap', '.Net', 'Oracle'],
      link: 'https://protectasecurity.pe/seguro-vida-ley',
      github: 'https://github.com/avmkui/app_proveedor',
    },
    {
      id: 4,
      title: t('mowaPlatform'),
      description: t('mowaDesc'),
      video: MowaVideo,
      tags: ['JavaScript', 'Java','Spring Boot', 'PostgreSQL'],
      link: 'https://www.contactahabilidad.com',
      github: 'https://github.com/avmkui/app_proveedor',
    },
    {
      id: 5,
      title: t('ecommercePlatform'),
      description: t('ecommerceDesc'),
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
      github: '#',
    },
    {
      id: 6,
      title: t('musicStreamingApp'),
      description: t('musicStreamingDesc'),
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React Native', 'Express', 'PostgreSQL', 'AWS'],
      link: '#',
      github: '#',
    },
    {
      id: 7,
      title: t('aiContentGenerator'),
      description: t('aiContentDesc'),
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['Python', 'TensorFlow', 'OpenAI', 'Flask'],
      link: '#',
      github: '#',
    },
    {
      id: 8,
      title: t('portfolioWebsite'),
      description: t('portfolioDesc'),
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['React', 'Framer Motion', 'Tailwind CSS', 'Vite'],
      link: '#',
      github: '#',
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

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };
  
  // Abrir pantalla completa para video
  const openFullscreen = (src: string, title: string) => {
    setFullscreenVideo({ src, title });
    document.body.style.overflow = 'hidden';
  };
  
  // Cerrar pantalla completa
  const closeFullscreen = () => {
    setFullscreenVideo(null);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section
      id="projects"
      className="relative w-full py-20 bg-gradient-to-b from-background to-surface"
      ref={ref}
    >
      {/* Modal de video en pantalla completa usando Portal */}
      {fullscreenVideo && (
        <FullscreenVideoPortal 
          src={fullscreenVideo.src} 
          title={fullscreenVideo.title} 
          onClose={closeFullscreen} 
        />
      )}
      
      <div className="container px-4 mx-auto md:px-6">
        <motion.div 
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('myProjects')}</h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            {t('projectsDescription')}
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative mt-10"
        >
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="mySwiper"
            style={{ paddingBottom: '3rem' }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id} style={{ width: '350px', height: '500px' }}>
                <motion.div 
                  className="flex flex-col h-full overflow-hidden bg-gray-900 shadow-xl project-card rounded-xl"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-48">
                    {project.video ? (
                      <CustomVideoPlayer 
                        src={project.video} 
                        title={project.title}
                        onFullscreen={openFullscreen}
                      />
                    ) : (
                      <ImageDisplay src={project.image} alt={project.title} />
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                    <p className="flex-1 mb-4 text-gray-400">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs text-gray-300 bg-gray-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between p-4 bg-gray-800/50">
                      <a
                        href={project.link}
                        className="flex items-center text-sm transition-colors text-primary-400 hover:text-primary-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {t('liveDemo')}
                      </a>
                      <a
                        href={project.github}
                        className="flex items-center text-sm text-gray-400 transition-colors hover:text-gray-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        {t('sourceCode')}
                      </a>
                    </div>

                  </div>
                  
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrevClick}
              className="flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-full hover:bg-primary-400"
              aria-label="Previous project"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextClick}
              className="flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-800 rounded-full hover:bg-primary-400"
              aria-label="Next project"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;