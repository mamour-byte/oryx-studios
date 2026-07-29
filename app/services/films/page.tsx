"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import FadeInSection from "../../animations/FadeInSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";

function getYouTubeEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v") || u.pathname.replace("/", "");
    return id ? `https://www.youtube.com/embed/${id}?rel=0&autoplay=1` : "";
  } catch { return ""; }
}

export default function FilmsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Transform films into album-like structure for the grid
          const filmAlbums = (data.films || []).map((film: any) => ({
            id: film.id,
            title: film.title,
            cover: film.thumbnail,
            videos: [{ type: film.sourceType, url: film.videoUrl }],
          }));
          setAlbums(filmAlbums);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const nextVideo = () => setCurrentIndex((p) => (p + 1) % activeAlbum.videos.length);
  const prevVideo = () => setCurrentIndex((p) => (p - 1 + activeAlbum.videos.length) % activeAlbum.videos.length);

  return (
    <main className="bg-white text-gray-900">
      <Navbar />
      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-24">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.25em] text-blue-600 font-semibold">NOS PRODUCTIONS</span>
            <h2 className="text-3xl md:text-4xl font-light mt-6 mb-6">
              Des films guidés par la <span className="text-blue-600">vision</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Clips musicaux, publicités et films institutionnels. Chaque production est pensée pour raconter une histoire unique.
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
          <p className="text-center text-gray-400 py-24">Aucune production disponible pour le moment.</p>
        ) : (
          <div className="grid w-full grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-4">
            {albums.map((album, i) => (
              <FadeInSection key={album.id} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer group bg-gray-900"
                  onClick={() => { setActiveAlbum(album); setCurrentIndex(0); }}
                >
                  {album.cover ? (
                    <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-800">
                      <span className="text-white/40 text-4xl">▶</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />
                  <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition">
                    <p className="text-sm font-semibold tracking-wide">{album.title}</p>
                    <span className="text-xs text-white/80">Voir la vidéo →</span>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        )}
      </section>

      {/* Visualisateur vidéo */}
      <AnimatePresence>
        {activeAlbum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            <button onClick={() => setActiveAlbum(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition">
              <X />
            </button>

            <div className="w-full max-w-5xl px-4">
              {(() => {
                const video = activeAlbum.videos[currentIndex];
                if (video.type === "youtube") {
                  return (
                    <iframe
                      key={currentIndex}
                      src={getYouTubeEmbedUrl(video.url)}
                      className="w-full aspect-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                return (
                  <video key={currentIndex} src={video.url} className="w-full aspect-video" controls autoPlay playsInline />
                );
              })()}
              <p className="text-white/70 text-center mt-4 text-sm">{activeAlbum.title}</p>
            </div>

            {activeAlbum.videos.length > 1 && (
              <>
                <button onClick={prevVideo} className="absolute left-6 text-white text-4xl opacity-70 hover:opacity-100 transition">‹</button>
                <button onClick={nextVideo} className="absolute right-6 text-white text-4xl opacity-70 hover:opacity-100 transition">›</button>
                <div className="absolute bottom-6 text-white/70 text-sm">{currentIndex + 1} / {activeAlbum.videos.length}</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
