"use client";
import { motion } from "framer-motion";
import FadeInSection from "../animations/FadeInSection";
import { Camera, Video, Film, Image, PenTool, Printer  } from "lucide-react";

const services = [
  {
    title: "Photographie",
    description: "Capturer l'instant avec précision et émotion.",
    icon: Camera,
  },
  {
    title: "Montage vidéo",
    description: "Un storytelling fluide et impactant.",
    icon: Video,
  },
  {
    title: "Films",
    description: "Productions cinématographiques modernes et immersives.",
    icon: Film,
  },
  {
    title: "Images aériennes",
    description: "Prises de vue drone pour une perspective unique.",
    icon: Image,
  },
  {
    title: "Graphisme",
    description: "Identité visuelle claire et cohérente.",
    icon: PenTool,
  },
  {
    title: "Prints",
    description: "Supports imprimés élégants et professionnels.",
    icon: Printer,
  },
  {
    title: "Motion Design",
    description: "Animations dynamiques et visuels captivants.",
    icon: Film,
  },
  {
    title: "Plan 3D",
    description: "Visualisations architecturales réalistes.",
    icon: Film,
  },
];


export default function Services() {
    return(
    <section className="mt-20 sm:py-10 md:py-35 lg:py-0 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="max-w-7xl mx-auto mb-10 px-4 sm:px-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
                Nos Services
            </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <FadeInSection key={index} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group p-6 sm:p-8 bg-white border border-gray-100 rounded-2xl hover:border-blue-600 hover:shadow-2xl transition-all duration-300 h-full"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <Icon
                          size={32}
                          className="text-blue-600 group-hover:text-white transition-colors duration-300"
                        />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                </FadeInSection>
              );
            })}
          </div>
        </div>

        <div className="py-10 sm:py-0 md:py-0 lg:py-0 bg-gradient-to-br from-blue-900 to-blue-700 text-white relative overflow-hidden">
        {/* Effet de background animé */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"
        />

        <div className="mt-10 mb-10 max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <FadeInSection>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-2">
              Prêt à donner vie à votre projet ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
              Discutons de vos idées et créons ensemble quelque chose
              d'exceptionnel.
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 sm:px-10 md:px-12 py-0 sm:py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl text-sm sm:text-base"
            >
              Démarrer un projet
            </motion.a>
          </FadeInSection>
        </div>
      </div>
      </section>

        );
}