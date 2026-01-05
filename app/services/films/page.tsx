"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Film,
  Award,
  Clock,
  Eye
} from "lucide-react";

// Interface pour typer les films
interface FilmType {
  id: number;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  client: string;
  year: string;
  awards: string | null;
}

// Données des films (remplacer par vos vraies vidéos)
const films: FilmType[] = [
  {
    id: 1,
    title: "Clip Akhlou Brick Thiompetance",
    category: "Clip",
    duration: "2:30",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/watch?v=sX9_nkfETwQ&list=RDsX9_nkfETwQ&start_radio=1",
    description: "Oryx Studios a produit le clip officiel du morceau 'Akhlou Brick', mettant en avant des visuels percutants et une narration captivante.",
    client: "Akhlou Brick",
    year: "2024",
    awards: "Best Corporate Film 2024",
  },
  {
    id: 2,
    title: "MANEL LEBOU NDOYE - SAMA WAAY",
    category: "Clip",
    duration: "2:45",
    thumbnail: "",
    videoUrl: "https://www.youtube.com/watch?v=wNsprOVGf1w",
    description: "Clip vibrant et artistique pour la chanson 'Sama Waay' de Manel Lebou Ndoye, capturant l'essence de la musique à travers des images évocatrices.",
    client: "Manel Lebou Ndoye",
    year: "2025",
    awards: null,
  },
  {
    id: 3,
    title: "Urban Exploration",
    category: "Documentaire",
    duration: "3:15",
    thumbnail: "https://picsum.photos/id/1018/800/450",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Une exploration cinématographique de l'architecture urbaine moderne.",
    client: "City Magazine",
    year: "2023",
    awards: "Prix du Public 2023",
  },
  {
    id: 4,
    title: "Product Launch - Galaxy X",
    category: "Publicité",
    duration: "1:00",
    thumbnail: "https://picsum.photos/id/1027/800/450",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "Un spot publicitaire dynamique pour le lancement d'un nouveau smartphone.",
    client: "Galaxy Mobile",
    year: "2024",
    awards: null,
  },
];

// Composant d'animation
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function FilmsPage() {
  const [selectedFilm, setSelectedFilm] = useState(films[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Contrôles vidéo
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        // Safari
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        // IE11
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  const handleFilmSelect = (film: FilmType) => {
    setSelectedFilm(film);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
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

      {/* Section Galerie + Lecteur */}
      <section className="py-20 sm:py-32 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
                Notre Portfolio Films
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sélectionnez un film dans la galerie pour le visionner
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-6 rounded-full"></div>
            </div>
          </FadeInSection>

          {/* Layout Galerie + Lecteur */}
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12">
            {/* GALERIE 2x2 - Gauche */}
            <FadeInSection delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Films récents</h3>
                  <span className="text-sm text-gray-500">{films.length} films</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {films.map((film, index) => (
                    <motion.div
                      key={film.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      onClick={() => handleFilmSelect(film)}
                      className={`group relative cursor-pointer rounded-2xl overflow-hidden ${
                        selectedFilm.id === film.id
                          ? "ring-4 ring-blue-600 shadow-2xl"
                          : "hover:shadow-xl"
                      } transition-all duration-300`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-gray-900">
                        <img
                          src={film.thumbnail}
                          alt={film.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                        {/* Play icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all"
                          >
                            <Play size={20} className="text-white ml-1" fill="white" />
                          </motion.div>
                        </div>

                        {/* Badge durée */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white font-medium">
                          {film.duration}
                        </div>

                        {/* Badge sélectionné */}
                        {selectedFilm.id === film.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 left-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                          >
                            <Eye size={16} className="text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                        <h4 className="text-white font-semibold text-sm line-clamp-1 mb-1">
                          {film.title}
                        </h4>
                        <p className="text-blue-300 text-xs font-medium">
                          {film.category}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* LECTEUR VIDÉO - Droite */}
            <FadeInSection delay={0.3}>
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Player container */}
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
                  <div className="relative aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full"
                      src={selectedFilm.videoUrl}
                      poster={selectedFilm.thumbnail}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Contrôles personnalisés */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="w-full p-6">
                        <div className="flex items-center gap-4">
                          {/* Play/Pause */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={togglePlay}
                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                          >
                            {isPlaying ? (
                              <Pause size={20} className="text-white" />
                            ) : (
                              <Play size={20} className="text-white ml-1" fill="white" />
                            )}
                          </motion.button>

                          {/* Volume */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMute}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            {isMuted ? (
                              <VolumeX size={18} className="text-white" />
                            ) : (
                              <Volume2 size={18} className="text-white" />
                            )}
                          </motion.button>

                          <div className="flex-1"></div>

                          {/* Fullscreen */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleFullscreen}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Maximize size={18} className="text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info du film sélectionné */}
                <motion.div
                  key={selectedFilm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-3xl border border-gray-100"
                >
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {selectedFilm.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Clock size={12} />
                      {selectedFilm.duration}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {selectedFilm.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {selectedFilm.description}
                  </p>

                  {/* Détails */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Client</p>
                      <p className="font-semibold text-gray-900">{selectedFilm.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Année</p>
                      <p className="font-semibold text-gray-900">{selectedFilm.year}</p>
                    </div>
                  </div>

                  {/* Awards */}
                  {selectedFilm.awards && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-amber-600">
                        <Award size={18} />
                        <span className="text-sm font-semibold">{selectedFilm.awards}</span>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <motion.a
                    href="../contact"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                  >
                    Un projet similaire ?
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.a>
                </motion.div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50+", label: "Films produits" },
                { value: "30+", label: "Clients satisfaits" },
                { value: "15", label: "Prix remportés" },
                { value: "10+", label: "Années d'expérience" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeInSection>
            <Film className="mx-auto mb-6 text-blue-600" size={56} />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Prêt à créer votre film ?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Discutons de votre projet et donnons vie à votre vision avec une production cinématographique de qualité.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full hover:shadow-2xl transition-all"
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