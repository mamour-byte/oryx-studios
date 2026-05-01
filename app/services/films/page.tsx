"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Film, Play, Youtube } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import FadeInSection from "../../animations/FadeInSection";

type SourceType = "youtube" | "video";

interface FilmType {
  id: number;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  sourceType: SourceType;
  description: string;
  client: string;
  year: string;
}

const films: FilmType[] = [
  {
    id: 1,
    title: "Akhlou Brick - Thiompetance",
    category: "Clip musical",
    duration: "2:30",
    thumbnail: "https://img.youtube.com/vi/sX9_nkfETwQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=sX9_nkfETwQ",
    sourceType: "youtube",
    description: "Un clip énergique avec une direction visuelle rythmée, pensée pour soutenir l'identité de l'artiste.",
    client: "Akhlou Brick",
    year: "2024",
  },
  {
    id: 2,
    title: "Manel Lebou Ndoye - Sama Waay",
    category: "Clip musical",
    duration: "2:45",
    thumbnail: "https://img.youtube.com/vi/wNsprOVGf1w/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=wNsprOVGf1w",
    sourceType: "youtube",
    description: "Une production sensible et lumineuse, portée par une mise en scène simple et élégante.",
    client: "Manel Lebou Ndoye",
    year: "2025",
  },
  {
    id: 3,
    title: "Kendrick Lamar - Dilemma ft SZA",
    category: "Clip musical",
    duration: "1:20",
    thumbnail: "https://img.youtube.com/vi/0kY48ON4Y4g/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=0kY48ON4Y4g&list=RD0kY48ON4Y4g&start_radio=1",
    sourceType: "youtube",
    description: "Un clip cinématographique et immersif, avec une esthétique visuelle marquée pour accompagner l'univers de l'artiste.",
    client: "Oryx Studios",
    year: "2026",
  },
  {
    id: 4,
    title: "Asap Rocky Praise The Lord ft Skepta",
    category: "Clip musical",
    duration: "3:15",
    thumbnail: "https://img.youtube.com/vi/Kbj2Zss-5GY/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Kbj2Zss-5GY&list=RD0kY48ON4Y4g&index=12",
    sourceType: "youtube",
    description: "Un clip sombre et stylisé, avec une esthétique visuelle forte pour accompagner l'univers de l'artiste.",
    client: "Artiste : ASAP Rocky",
    year: "2026",
  },
];

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    let videoId = "";

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    } else if (parsedUrl.pathname.includes("/embed/")) {
      videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
    } else if (parsedUrl.pathname.includes("/shorts/")) {
      videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
    } else {
      videoId = parsedUrl.searchParams.get("v") || "";
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : "";
  } catch {
    return "";
  }
}

export default function FilmsPage() {
  const [selectedFilm, setSelectedFilm] = useState<FilmType>(films[0]);

  const youtubeEmbedUrl = useMemo(() => {
    if (selectedFilm.sourceType !== "youtube") return "";
    return getYouTubeEmbedUrl(selectedFilm.videoUrl);
  }, [selectedFilm]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* hero  */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/20 backdrop-blur-md rounded-2xl mb-6 border border-blue-500/30"
          >
            <Film size={40} className="text-blue-400" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Productions
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              de Films et Clips vidéo
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Découvrez notre portfolio de clips, films, documentaires et contenus audiovisuels qui racontent des histoires captivantes.
          </p>
        </motion.div>
      </section>

      

      {/* Zone modifiée : galerie vidéo simplifiée avec lecteur YouTube ou MP4. */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeInSection>
            <div className="mb-12 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                Portfolio films
              </span>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-950 sm:text-5xl">
                Une galerie claire pour explorer nos productions.
              </h1>
              <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
                {"Sélectionnez une réalisation : le lecteur s'adapte automatiquement aux sources YouTube et aux fichiers vidéo."}
              </p>
            </div>
          </FadeInSection>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <FadeInSection delay={0.1}>
              <div className="overflow-hidden border border-gray-200 bg-black">
                <div className="aspect-video">
                  {selectedFilm.sourceType === "youtube" && youtubeEmbedUrl ? (
                    <iframe
                      key={selectedFilm.id}
                      src={youtubeEmbedUrl}
                      title={selectedFilm.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={selectedFilm.id}
                      className="h-full w-full object-cover"
                      src={selectedFilm.videoUrl}
                      poster={selectedFilm.thumbnail}
                      controls
                      playsInline
                    />
                  )}
                </div>
              </div>

              <motion.div
                key={selectedFilm.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="border-x border-b border-gray-200 bg-white p-6 sm:p-8"
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    {selectedFilm.sourceType === "youtube" ? <Youtube size={14} /> : <Film size={14} />}
                    {selectedFilm.category}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    <Clock size={14} />
                    {selectedFilm.duration}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-950 sm:text-3xl">
                  {selectedFilm.title}
                </h2>
                <p className="mt-4 max-w-3xl text-gray-600">
                  {selectedFilm.description}
                </p>

                <div className="mt-6 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Client</p>
                    <p className="mt-1 font-semibold text-gray-950">{selectedFilm.client}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Année</p>
                    <p className="mt-1 font-semibold text-gray-950">{selectedFilm.year}</p>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              {/* Zone modifiée : galerie alignée en deux vidéos par ligne. */}
              <div className="grid grid-cols-2 gap-4">
                {films.map((film) => {
                  const isSelected = selectedFilm.id === film.id;

                  return (
                    <button
                      key={film.id}
                      type="button"
                      onClick={() => setSelectedFilm(film)}
                      className={`group overflow-hidden border text-left transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-900/10"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-900">
                        <img
                          src={film.thumbnail}
                          alt={film.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-blue-700">
                            <Play size={16} fill="currentColor" />
                          </span>
                        </div>
                        <div className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {film.sourceType === "youtube" ? "YouTube" : "MP4"}
                        </div>
                      </div>

                      {/* <div className="p-3">
                        <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold leading-5 text-gray-950">
                          {film.title}
                        </h3>
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                          <span className="truncate">{film.category}</span>
                          <span>{film.duration}</span>
                        </div>
                      </div> */}
                    </button>
                  );
                })}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-black py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4">
          {[
            { value: "50+", label: "Films produits" },
            { value: "30+", label: "Clients satisfaits" },
            { value: "15", label: "Prix remportés" },
            { value: "10+", label: "Années d'expérience" },
          ].map((stat) => (
            <FadeInSection key={stat.label}>
              <div>
                <p className="text-4xl font-bold text-blue-300 sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      <section className="bg-white py-24 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <FadeInSection>
            <Film className="mx-auto mb-6 text-blue-600" size={56} />
            <h2 className="text-3xl font-bold text-gray-950 sm:text-5xl">
              {"Prêt à créer votre film ?"}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
              {"Discutons de votre projet et donnons vie à votre vision avec une production cinématographique de qualité."}
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-10 inline-flex px-10 py-4 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Démarrer un projet
            </motion.a>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
