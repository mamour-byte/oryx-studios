"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight, Layers, Type, Palette, Monitor, Package, Megaphone } from "lucide-react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FadeInSection from "../../animations/FadeInSection";
import LazyImage from "../../components/LazyImage";
import Slider from "@/app/components/Slider";

/* ─── Types ─────────────────────────────────────────────── */
interface Photo {
  src: string;
  blur?: string;
}

/* ─── Services graphiques ────────────────────────────────── */
const SERVICES = [
  { icon: Palette,  label: "Identité visuelle",      desc: "Logo, charte graphique, brand book" },
  { icon: Type,     label: "Typographie & Print",    desc: "Affiches, flyers, brochures, cartes" },
  { icon: Monitor,  label: "Design digital",         desc: "UI, bannières, visuels réseaux sociaux" },
  { icon: Package,  label: "Packaging",              desc: "Étiquettes, boîtes, habillage produit" },
  { icon: Layers,   label: "Motion & Montage",       desc: "Animations, génériques, intros vidéo" },
  { icon: Megaphone,"label": "Campagnes publicitaires", desc: "Visuels print & digital 360°" },
];

/* ─── Stats ──────────────────────────────────────────────── */
const STATS = [
  { value: "120+", label: "Projets livrés" },
  { value: "50+",  label: "Clients satisfaits" },
  { value: "5 ans", label: "D'expérience" },
];

export default function GraphismePage() {
  const [photos, setPhotos]       = useState<Photo[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lightbox, setLightbox]   = useState<{ photos: Photo[]; index: number } | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((data) => {
        const all: Photo[] = [];
        for (const album of data.albums ?? []) {
          const blurs: string[] = album.blurs ?? [];
          (album.photos ?? []).forEach((src: string, i: number) => {
            all.push({ src, blur: blurs[i] });
          });
        }
        setPhotos(all);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openLightbox = (index: number) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const prev = () => lightbox && setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.photos.length) % lightbox.photos.length });
  const next = () => lightbox && setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.photos.length });

  return (
    <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] overflow-hidden pt-24 pb-16">
        {/* Grain texture overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        {/* Accent blob */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]"
          >
            Des visuelles qui{" "}
            <span className="relative inline-block">
              <span className="relative z-10" style={{ color: "#1d4ed8" }}>parlent</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-1 left-0 right-0 h-[3px] origin-left"
                style={{ background: "#d6ad60" }}
              />
            </span>{" "}
            pour vous
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Identités visuelles, supports print & digital — nous concevons des créations graphiques qui captivent, distinguent et durent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#gallery"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "#1d4ed8" }}
            >
              Voir les réalisations <ArrowRight size={16} />
            </a>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-400 transition-all hover:scale-105"
            >
              Demander un devis
            </Link>
          </motion.div>
        </div>

        {/* Floating preview images — static local assets */}
        <div className="relative z-10 mt-16 w-full max-w-5xl mx-auto px-6 h-64 hidden md:block">
          {[
            { src: "/assets/Roll_Up.jpg",    rotate: "-4deg", delay: 0.6,  style: "absolute left-[2%]   top-[10px]  w-44" },
            { src: "/assets/mockup.jpg",     rotate: "1deg",  delay: 0.75, style: "absolute left-[24%]  top-[-20px] w-52" },
            { src: "/assets/a4mockup.jpg", rotate: "-1deg", delay: 0.9,  style: "absolute left-[50%]  top-[5px]   w-48 -translate-x-1/2" },
            { src: "/assets/blm.jpg",        rotate: "3deg",  delay: 1.05, style: "absolute right-[22%] top-[-10px] w-48" },
            { src: "/assets/Roll_Up 1.jpg",  rotate: "-3deg", delay: 1.2,  style: "absolute right-[1%]  top-[10px]  w-44" },
          ].map(({ src, rotate, delay, style }, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay }}
              className={`${style} rounded-xl overflow-hidden shadow-2xl absolute`}
              style={{ transform: `rotate(${rotate})`, animation: `float-hero ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }}
            >
              <img src={src} alt="" className="w-full h-48 object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GALLERY GRID ─────────────────────────────────────── */}
      <section id="gallery" className="mt-20 mb-10 sm:py-0 md:py-0 lg:py-14">
    <div className="max-w-[1200px] mx-auto px-4 sm:px-0">
      {/* <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r from-gray-900 via-blue-900 to-blue-600 bg-clip-text text-transparent">
        Galerie
      </h2> */}

          <div className="gallery-grid">
            <div className="gallery-item large">
              <img src="/assets/mockup.jpg" alt="Photographie" />
              <div className="caption">
                {/* <span className="tag">PRODUCTIONS</span>
                <h3>Films</h3>
                <p>Réalisation de films et direction artistique</p> */}
              </div>
            </div>

            <div className="gallery-item vertical">
              <img src="/assets/Roll_Up 1.jpg" alt="Vidéo" />
              <div className="caption">
                {/* <span className="tag">Graphisme</span>
                <h3>Infographie</h3>
                <p>Affiche flyers depliables </p> */}
              </div>
            </div>

            <div className="gallery-item">
              <img src="/assets/Roll_Up.jpg" alt="Graphisme" />
              <div className="caption">
                {/* <span className="tag">PRODUCTIONS</span>
                <h3>Photographie</h3> */}
              </div>
            </div>

            <div className="gallery-item wide">
              <img src="/assets/carte.jpg" alt="Montage & 3D" />
              <div className="caption">
                {/* <span className="tag">PRODUCTIONS</span>
                <h3>Montage & 3D</h3>
                <p>Rendu fluide et immersif</p> */}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-auto-rows: 320px;
            gap: 20px;
          }

          .gallery-item {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            border-radius: 8px;
          }

          .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .gallery-item::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.6),
              rgba(0, 0, 0, 0)
            );
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .gallery-item:hover::after {
            opacity: 1;
          }

          .gallery-item:hover img {
            transform: scale(1.05);
          }

          .caption {
            position: absolute;
            bottom: 24px;
            left: 24px;
            color: white;
            z-index: 2;
          }

          .caption .tag {
            font-size: 11px;
            letter-spacing: 1px;
            opacity: 0.85;
          }

          .caption h3 {
            font-size: 22px;
            margin: 6px 0;
          }

          .caption p {
            font-size: 14px;
            opacity: 0.85;
          }

          .large {
            grid-column: span 3;
            grid-row: span 2;
          }

          .vertical {
            grid-row: span 2;
          }

          .wide {
            grid-column: span 3;
          }

          @media (max-width: 900px) {
            .gallery-grid {
              grid-template-columns: 1fr 1fr;
              grid-auto-rows: 200px;
            }

            .large,
            .wide,
            .vertical {
              grid-column: span 2;
              grid-row: span 1;
            }
          }

          @media (max-width: 500px) {
            .gallery-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </section>


      {/* ── INTRO ────────────────────────────────────────────── */}
      {/* <section className="max-w-5xl mx-auto px-6 py-28">
        <FadeInSection>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs tracking-[0.25em] font-semibold text-blue-600 uppercase">Notre approche</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Du concept à la création,<br />
                <span style={{ color: "#d6ad60" }}>chaque pixel compte.</span>
              </h2>
            </div>
            <div>
              <p className="text-gray-500 leading-relaxed mb-4">
                Chez Oryx Studios, le graphisme n'est pas une décoration — c'est un langage. Nous construisons des identités visuelles cohérentes qui reflètent l'essence de votre marque et parlent directement à votre audience.
              </p>
              <p className="text-gray-500 leading-relaxed">
                De la conception d'un logo à la mise en page d'une campagne complète, chaque projet est traité avec rigueur, créativité et une attention particulière aux détails.
              </p>
            </div>
          </div>
        </FadeInSection>
      </section> */}

      
      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-28">
        <FadeInSection>
          <div className="text-center mb-16">
            <span className="text-xs tracking-[0.25em] font-semibold text-blue-600 uppercase">Ce que nous faisons</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">Nos expertises graphiques</h2>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <FadeInSection key={s.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-blue-600"
                  style={{ background: "#f0f4ff" }}>
                  <s.icon size={22} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.label}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mx-4 mb-20 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)" }}>
        <FadeInSection>
          <div className="max-w-3xl mx-auto text-center px-6 py-24">
            <span className="text-xs tracking-[0.25em] font-semibold text-blue-200 uppercase">Travaillons ensemble</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-white leading-tight">
              Un projet graphique<br />en tête ?
            </h2>
            <p className="mt-5 text-blue-200 text-lg max-w-xl mx-auto">
              Partagez-nous votre vision — nous la transformons en une identité visuelle qui vous ressemble.
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-blue-700 bg-white hover:bg-blue-50 transition-all hover:scale-105 text-sm"
            >
              Démarrer un projet <ArrowRight size={16} />
            </Link>
          </div>
        </FadeInSection>
      </section>

      {/* ── LIGHTBOX ─────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>

            <motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={lightbox.photos[lightbox.index].src}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain select-none rounded-lg"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => { if (info.offset.x < -80) next(); if (info.offset.x > 80) prev(); }}
            />

            <button onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 text-white/60 hover:text-white text-5xl transition">‹</button>
            <button onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 text-white/60 hover:text-white text-5xl transition">›</button>

            <div className="absolute bottom-6 text-white/40 text-xs tracking-widest">
              {lightbox.index + 1} / {lightbox.photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float animation */}
      <style>{`
        @keyframes float-hero {
          0%, 100% { transform: translateY(0px) rotate(var(--tw-rotate, 0deg)); }
          50%       { transform: translateY(-12px) rotate(var(--tw-rotate, 0deg)); }
        }
      `}</style>

      <Footer />
    </main>
  );
}
