import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const ref = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { t } = useTranslation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // EmailJS configuration
      const serviceId = 'service_yrvping'; // You need to replace this
      const templateId = 'template_wtjdvfu'; // You need to replace this
      const publicKey = 'i00B3x3tg_Jodavdl'; // You need to replace this
      
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'alex_3120@hotmail.com',
      };
      
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('correo'),
      value: 'alex_3120@hotmail.com',
      link: 'mailto:alex_3120@hotmail.com',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('telefono'),
      value: '+51 912285221',
      link: 'tel:+51912285221',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      value: '+51 912285221',
      link: 'https://wa.me/51912285221?text=Hola%20Alexander,%20me%20interesa%20contactarte',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('ubicacion'),
      value: 'Lima, Perú',
      link: '#',
    },
  ];
  
  return (
    <section id="contact" className="py-20 relative bg-gradient-to-b from-surface to-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contactTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('contactDescription')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">{t('contactInformation')}</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={index}
                    href={method.link}
                    target={method.title === 'WhatsApp' ? '_blank' : undefined}
                    rel={method.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mt-1 text-primary-400 group-hover:text-primary-300 transition-colors">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">{method.title}</p>
                      <p className="text-gray-400">{method.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{t('connectWithMe')}</h3>
              <p className="text-gray-400 mb-4">
                {t('connectDescription')}
              </p>
              <div className="flex gap-4">
                {/* <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a> */}
                <a 
                  href="https://www.linkedin.com/in/alexander-miguel-valverde-pireta-8a9421180" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14C2.238 0 0 2.238 0 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zM7.12 20H3.98V9h3.14v11zM5.55 7.4c-1.006 0-1.82-.814-1.82-1.82s.814-1.82 1.82-1.82 1.82.814 1.82 1.82S6.556 7.4 5.55 7.4zM20 20h-3.14v-5.56c0-1.32-.03-3.02-1.84-3.02-1.84 0-2.12 1.43-2.12 2.91V20h-3.14V9h3.01v1.51h.04c.42-.79 1.45-1.63 2.99-1.63 3.2 0 3.79 2.11 3.79 4.85V20z"/>
                  </svg>
                </a>

                <a 
                  href="https://discord.com/users/AMAKUI#3423" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-400 hover:text-white transition-colors"
                  aria-label="Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.07.07 0 00-.073.035c-.211.375-.444.864-.608 1.249a18.644 18.644 0 00-5.51 0 12.203 12.203 0 00-.622-1.25.069.069 0 00-.073-.034 19.736 19.736 0 00-4.885 1.515.064.064 0 00-.03.027C2.247 9.04 1.73 13.579 2.09 18.057a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.032.07.07 0 00.078-.027c.462-.63.873-1.295 1.226-1.994a.07.07 0 00-.038-.095 13.177 13.177 0 01-1.872-.889.07.07 0 01-.007-.117c.126-.094.252-.192.371-.291a.07.07 0 01.073-.01c3.927 1.793 8.18 1.793 12.061 0a.07.07 0 01.074.009c.12.099.245.198.372.292a.07.07 0 01-.006.117 12.64 12.64 0 01-1.873.888.07.07 0 00-.038.096c.36.699.771 1.364 1.225 1.993a.07.07 0 00.078.028 19.876 19.876 0 006.001-3.03.077.077 0 00.03-.056c.404-4.23-.674-8.725-2.975-13.661a.06.06 0 00-.03-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z"/>
                  </svg>
                </a>

                <a 
                  href="https://github.com/AlexanderVP31" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                
                <a 
                  href="https://github.com/avmkui" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-primary-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://wa.me/51912285221?text=Hola%20Alexander,%20me%20interesa%20contactarte" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:bg-green-500 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800/30 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">{t('sendMessage')}</h3>
              
              {isSubmitted ? (
                <motion.div 
                  className="bg-accent-400/20 border border-accent-400/30 rounded-lg p-4 text-accent-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-medium">{t('thankYou')}</p>
                  <p className="text-sm">{t('thankYouDesc')}</p>
                </motion.div>
              ) : (
                <>
                  {submitError && (
                    <motion.div 
                      className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm">{submitError}</p>
                    </motion.div>
                  )}
                  
                  {/* <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-400 mb-6">
                    <p className="text-sm font-medium mb-2">📧 Configuración de EmailJS requerida</p>
                    <p className="text-xs">
                      Para que el formulario funcione, necesitas configurar EmailJS:
                      <br />1. Crea una cuenta en <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a>
                      <br />2. Configura un servicio de email
                      <br />3. Crea un template de email
                      <br />4. Reemplaza las variables en el código (SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY)
                    </p>
                  </div> */}
                  
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">{t('name')}</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">{t('email')}</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">{t('subject')}</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">{t('message')}</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn-primary flex items-center justify-center w-full ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                            <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('sendMessageBtn')}
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;