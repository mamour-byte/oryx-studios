"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FadeInSection from "../../animations/FadeInSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

/* =====================
   DATA : ALBUMS
===================== */

const albums = [
  {
    id: "event-1",
    title: "Mariage – Dakar",
    cover: "https://picsum.photos/id/1011/1600/1200",
    photos: [
      "https://picsum.photos/id/1011/1600/1200",
      "https://picsum.photos/id/1015/1600/1200",
      "https://picsum.photos/id/1025/1600/1200",
    ],
  },
  {
    id: "event-2",
    title: "Shooting Corporate",
    cover: "https://picsum.photos/id/1035/1600/1200",
    photos: [
      "https://picsum.photos/id/1035/1600/1200",
      "https://picsum.photos/id/1041/1600/1200",
      "https://picsum.photos/id/1050/1600/1200",
    ],
  },
  {
    id: "event-3",
    title: "Événement Culturel",
    cover: "https://picsum.photos/id/1060/1600/1200",
    photos: [
      "https://picsum.photos/id/1060/1600/1200",
      "https://picsum.photos/id/1069/1600/1200",
      "https://picsum.photos/id/1074/1600/1200",
    ],
  },
];

/* =====================
   PAGE
===================== */

export default function PhotographiePage() {
  const [activeAlbum, setActiveAlbum] = useState<
    typeof albums[0] | null
  >(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPhoto = () => {
    if (!activeAlbum) return;
    setCurrentIndex((prev) =>
      prev === activeAlbum.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    if (!activeAlbum) return;
    setCurrentIndex((prev) =>
      prev === 0 ? activeAlbum.photos.length - 1 : prev - 1
    );
  };

  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* =====================
          HERO
      ===================== */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={albums[0].cover}
          alt="Photographie"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <FadeInSection>
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Photographie
              </h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed">
                Capturer l’instant, révéler l’émotion, sublimer chaque détail.
                Chaque image raconte une histoire authentique.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* =====================
          INTRO
      ===================== */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.25em] text-blue-600 font-semibold">
              NOTRE APPROCHE
            </span>
            <h2 className="text-3xl md:text-4xl font-light mt-6 mb-6">
              Une photographie guidée par la{" "}
              <span className="text-blue-600">sensibilité</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Chaque événement est couvert comme un reportage unique. Nous
              privilégions l’émotion, la lumière naturelle et une narration
              visuelle élégante.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* =====================
          GALERIE (ALBUMS)
      ===================== */}
      <section className="max-w-[1400px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {albums.map((album, i) => (
            <FadeInSection key={album.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
                onClick={() => {
                  setActiveAlbum(album);
                  setCurrentIndex(0);
                }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-[380px] object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />

                <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition">
                  <p className="text-sm font-semibold tracking-wide">
                    {album.title}
                  </p>
                  <span className="text-xs text-white/80">
                    Voir l’album →
                  </span>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* =====================
          VIEWER ALBUM
      ===================== */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          >
            {/* Close */}
            <button
              onClick={() => setActiveAlbum(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              <X />
            </button>

            {/* Image */}
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              src={activeAlbum.photos[currentIndex]}
              alt="Album"
              className="max-w-[90vw] max-h-[85vh] object-contain select-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) nextPhoto();
                if (info.offset.x > 80) prevPhoto();
              }}
            />

            {/* Navigation */}
            <button
              onClick={prevPhoto}
              className="absolute left-6 md:left-10 text-white text-4xl opacity-70 hover:opacity-100 transition"
            >
              ‹
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-6 md:right-10 text-white text-4xl opacity-70 hover:opacity-100 transition"
            >
              ›
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 text-white/70 text-sm">
              {currentIndex + 1} / {activeAlbum.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
