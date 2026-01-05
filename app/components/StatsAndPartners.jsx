import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ======================
   FADE IN SECTION
====================== */
function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ======================
   COUNTER AVEC ANIMATIONS
====================== */
function AnimatedCounter({ value, label, icon, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex flex-col items-center text-center"
    >
      {/* Effet de halo au survol */}
      <div className="absolute inset-0 bg-blue-500/5 rounded-3xl scale-0 group-hover:scale-100 transition-transform duration-500 -z-10" />
      
      {/* Icône avec animation */}
      <motion.div 
        className="mb-6 text-blue-600 relative"
        animate={isInView ? { 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ 
          duration: 2,
          delay: delay + 0.5,
          ease: "easeInOut"
        }}
      >
        {icon}
        
        {/* Cercle décoratif */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-blue-200/50 -z-10"
          initial={{ scale: 1, opacity: 0 }}
          animate={isInView ? { 
            scale: [1, 1.4, 1.4],
            opacity: [0, 0.3, 0]
          } : {}}
          transition={{ 
            duration: 2,
            delay: delay + 0.3,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      </motion.div>

      {/* Nombre avec effet de lueur */}
      <div className="relative">
        <span className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 tracking-tight tabular-nums">
          {count}
        </span>
        <motion.span 
          className="text-5xl sm:text-6xl md:text-7xl font-light text-blue-600"
          animate={{ 
            opacity: [1, 0.6, 1],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          +
        </motion.span>
      </div>

      {/* Label avec ligne décorative */}
      <div className="mt-5 flex flex-col items-center">
        <motion.div 
          className="h-px w-8 bg-gradient-to-r from-transparent via-blue-400 to-transparent mb-3"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 32, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: delay + 0.6 }}
        />
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-500 font-light">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

/* ======================
   COMPOSANT PRINCIPAL
====================== */
export default function StatsAndPartners() {
  const partners = [
    "Google",
    "Orange",
    "Wave",
    "Free",
    "Total",
    "Canal+",
    "Ecobank",
    "Sonatel",
  ];

  return (
    <section className="mb-10 relative bg-white pt-32 pb-32 overflow-hidden">
      {/* Motif géométrique subtil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
      </div>

      {/* ======================
          NOS CHIFFRES
      ====================== */}
      <FadeInSection>
        <div className="relative max-w-7xl mx-auto px-6 mb-32">
          <div className="max-w-3xl mx-auto text-center mb-24">
            {/* Badge avec animation */}
            <motion.span 
              className="inline-block text-xs tracking-[0.35em] text-blue-600 font-semibold mb-6 px-4 py-2 rounded-full bg-blue-50/50 backdrop-blur-sm border border-blue-100/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              PERFORMANCE & IMPACT
            </motion.span>

            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Des résultats{" "}
              <span className="relative inline-block">
                <span className="relative z-10">mesurables</span>
                <motion.span
                  className="absolute bottom-2 left-0 right-0 h-3 bg-blue-200/40 -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h2>
          </div>

          {/* Grille des compteurs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <AnimatedCounter
              value={120}
              label="Projets livrés"
              delay={0}
              icon={
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
              }
            />

            <AnimatedCounter
              value={60}
              label="Clients satisfaits"
              delay={0.1}
              icon={
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />

            <AnimatedCounter
              value={8}
              label="Années d'expertise"
              delay={0.2}
              icon={
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />

            <AnimatedCounter
              value={15}
              label="Partenaires actifs"
              delay={0.3}
              icon={
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <circle cx="20" cy="8" r="2" />
                </svg>
              }
            />
          </div>
        </div>
      </FadeInSection>

     

      {/* ======================
          PARTENAIRES
      ====================== */}
      <FadeInSection delay={0.3}>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block text-xs tracking-[0.35em] text-blue-600 font-semibold px-4 py-2 rounded-full bg-blue-50/50 backdrop-blur-sm border border-blue-100/50"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ILS NOUS FONT CONFIANCE
            </motion.span>
          </div>

          {/* Carrousel de logos avec effet de profondeur */}
          <div className="mt-10 relative overflow-hidden py-12">
            {/* Effet de parallaxe sur le fond */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-blue-50/20"
              animate={{ x: ["0%", "100%"] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="flex items-center gap-20 md:gap-32"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...partners, ...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={index}
                  className="text-xl md:text-2xl font-light tracking-wide text-gray-400 whitespace-nowrap cursor-pointer relative group"
                  whileHover={{ 
                    scale: 1.1,
                    color: "rgb(37, 99, 235)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {partner}
                  
                  {/* Soulignement au survol */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </motion.div>
              ))}
            </motion.div>

            {/* Dégradés latéraux améliorés */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}