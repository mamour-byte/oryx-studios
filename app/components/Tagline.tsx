"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import FadeInSection from "../animations/FadeInSection";

export default function Tagline() {
  const images = [
    "https://picsum.photos/id/1018/900/1200",
    "https://picsum.photos/id/1021/900/1200",
    "https://picsum.photos/id/1031/900/1200",
  ];

  const [current, setCurrent] = useState(0);
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);

  /* Scroll automatique */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      {/* TAGLINE */}
      <section className=" pt-10 pb-10 sm:pt-24 sm:pb-16 px-4 sm:px-6 text-center bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none"></div>

        <FadeInSection>
          <h2 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-bold max-w-5xl mx-auto leading-tight sm:leading-snug px-4">
            Là où les idées {" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                deviennent des images d’exception
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 origin-left"
              />
            </span>
          </h2>
        </FadeInSection>
      </section>

      {/* SECTION VISION */}
      <section className="max-w-[1200px] mx-auto mt-20 mb-28 sm:mt-24 sm:mb-36 px-4 sm:px-6">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 sm:gap-16 md:gap-20 items-center">

          {/* SLIDER IMAGE */}
          <FadeInSection>
            <div
              className="relative overflow-hidden rounded-lg shadow-2xl group"
              onMouseMove={(e) => {
                const { left, width } = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - left;
                setHoverSide(x < width / 2 ? "left" : "right");
              }}
              onMouseLeave={() => setHoverSide(null)}
              onClick={() => {
                if (hoverSide === "left") prevImage();
                if (hoverSide === "right") nextImage();
              }}
            >
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] cursor-pointer">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current}
                    src={images[current]}
                    alt="Architecture"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </AnimatePresence>
              </div>

              {/* Overlay conservé */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Flèche gauche */}
              {hoverSide === "left" && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl pointer-events-none select-none"
                >
                  ←
                </motion.div>
              )}

              {/* Flèche droite */}
              {hoverSide === "right" && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl pointer-events-none select-none"
                >
                  →
                </motion.div>
              )}
            </div>
          </FadeInSection>

          {/* CONTENT */}
          <FadeInSection delay={0.2}>
            <div className="max-w-[480px] mx-auto md:mx-0">
              <span className="text-[11px] sm:text-xs tracking-[0.2em] text-blue-600 font-semibold block mb-4 sm:mb-6">
                NOTRE VISION
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug mb-4 sm:mb-6 text-gray-900">
                ORYX Studios  
                <br />
                <span className="text-blue-600">adopte une approche institutionnelle</span>
              </h2>

              <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                Nous accompagnons les marques, entreprises et institutions dans la conception de contenus clairs, cohérents et porteurs de sens, pensés pour valoriser leur image et renforcer leur message.
              <br />
                Chaque projet est développé avec rigueur, depuis la réflexion stratégique jusqu’à la réalisation finale, en alliant maîtrise technique, narration visuelle et identité forte.
                Notre ambition est de produire des contenus audiovisuels durables, capables de marquer les esprits tout en répondant aux standards professionnels les plus élevés.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                Dans cette continuité, ORYX Studios intègre également la création de plans 3D, afin d’enrichir la narration, illustrer des concepts complexes et offrir une lecture visuelle plus immersive des projets.
              </p>

            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  );
}
