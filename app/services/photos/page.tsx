"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FadeInSection from "../../animations/FadeInSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PhotoSlider from "../../components/PhotoSlider";

/* =====================
   DATA : ALBUMS
===================== */

const albums = [
  {
    id: "event-1",
    title: "Shooting Photo",
    cover: "../assets/y3.jpg",
    photos: [
      "../assets/y1.jpg",
      "../assets/y2.jpg",
      "../assets/y3.jpg",
      "../assets/y4.jpg",
    ],
  },
  {
    id: "event-2",
    title: "Shooting Corporate",
    cover: "../assets/yy3.jpg",
    photos: [
      "../assets/yy1.jpg",
      "../assets/yy2.jpg",
      "../assets/yy3.jpg",
      "../assets/yy4.jpg",
      "../assets/yy5.jpg",
    ],
  },
  {
    id: "event-3",
    title: "Mariage",
    cover: "../assets/M1.jpg",
    photos: [
      "../assets/M1.jpg",
      "../assets/M2.jpg",
      "../assets/M3.jpg",
      "../assets/M4.jpg",
      "../assets/M5.jpg",
    ],
  },
  {
    id: "event-4",
    title: "Portraits Artistiques",
    cover: "../assets/oryx2.jpg",
    photos: [
      "../assets/oryx1.jpg",
      "../assets/oryx2.jpg",
      "../assets/oryx3.jpg",
      "../assets/oryx4.jpg",
    ],
  },
  {
    id: "event-3",
    title: "Événement Culturel",
    cover: "../assets/mor1.jpg",
    photos: [
      "../assets/mor.jpg",
      "../assets/mor1.jpg",
      "../assets/mor3.jpg",
    ],
  },
  {
    id: "event-4",
    title: "Portraits Artistiques",
    cover: "../assets/f1.jpg",
    photos: [
      "../assets/f1.jpg",
      "../assets/f2.jpg",
      "../assets/f3.jpg",
      "../assets/f4.jpg",
      "../assets/f5.jpg",

    ],
  },
  {
    id: "event-4",
    title: "Portraits Artistiques",
    cover: "../assets/1.jpg",
    photos: [
      "../assets/1.jpg",
      "../assets/2.jpg",
      "../assets/3.jpg",
      "../assets/4.jpg",
      "../assets/5.jpg",
      "../assets/6.jpg",
      "../assets/7.jpg",

    ],
  },
  {
    id: "event-4",
    title: "Portraits Artistiques",
    cover: "../assets/h1.jpg",
    photos: [
      "../assets/h1.jpg",
      "../assets/h2.jpg",
      "../assets/h3.jpg",

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
      <PhotoSlider /> 

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
      {/* Zone modifiée : galerie pleine largeur, sans espacement entre les albums. */}
      <section className="w-full pb-32">
        <div className="grid w-full grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-4">
          {albums.map((album, i) => (
            <FadeInSection key={`${album.id}-${i}`} delay={i * 0.05}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-none shadow-none cursor-pointer group"
                onClick={() => {
                  setActiveAlbum(album);
                  setCurrentIndex(0);
                }}
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover bg-gray-100"
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
