"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import FadeInSection from "../../animations/FadeInSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PhotoSlider from "../../components/PhotoSlider";

export default function PhotographiePage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => { if (data.success) setAlbums(data.albums || []); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const nextPhoto = () => setCurrentIndex((p) => (p + 1) % activeAlbum.photos.length);
  const prevPhoto = () => setCurrentIndex((p) => (p - 1 + activeAlbum.photos.length) % activeAlbum.photos.length);

  return (
    <main className="bg-white text-gray-900">
      <Navbar />
      <PhotoSlider />

      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.25em] text-blue-600 font-semibold">NOTRE APPROCHE</span>
            <h2 className="text-3xl md:text-4xl font-light mt-6 mb-6">
              Une photographie guidée par la <span className="text-blue-600">sensibilité</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Chaque événement est couvert comme un reportage unique. Nous privilégions l'émotion, la lumière naturelle et une narration visuelle élégante.
            </p>
          </div>
        </FadeInSection>
      </section>

      <section className="w-full pb-32">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : albums.length === 0 ? (
          <p className="text-center text-gray-400 py-24">Aucun album disponible pour le moment.</p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-4">
            {albums.map((album, i) => (
              <FadeInSection key={album.id} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer group"
                  onClick={() => { setActiveAlbum(album); setCurrentIndex(0); }}
                >
                  <img src={album.cover} alt={album.title} className="h-full w-full object-cover bg-gray-100" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />
                  <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition">
                    <p className="text-sm font-semibold tracking-wide">{album.title}</p>
                    <span className="text-xs text-white/80">Voir l'album →</span>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {activeAlbum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <button onClick={() => setActiveAlbum(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition">
              <X />
            </button>
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
              onDragEnd={(_, info) => { if (info.offset.x < -80) nextPhoto(); if (info.offset.x > 80) prevPhoto(); }}
            />
            <button onClick={prevPhoto} className="absolute left-6 md:left-10 text-white text-4xl opacity-70 hover:opacity-100 transition">‹</button>
            <button onClick={nextPhoto} className="absolute right-6 md:right-10 text-white text-4xl opacity-70 hover:opacity-100 transition">›</button>
            <div className="absolute bottom-6 text-white/70 text-sm">{currentIndex + 1} / {activeAlbum.photos.length}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
