import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  // {
  //   id: 1,
  //   type: "video",
  //   video: "/assets/DJI_0116.MP4",
  //   tag: "Film",
  //   headline: "Oryx Studios",
  //   subline: "en mouvement.",
  //   detail: "Films, images aériennes & productions visuelles",
  //   accent: "#7dd3fc",
  // },
  {
    id: 1,
    type: "image",
    image: "/assets/slader1.jpg",
    tag: "Oryx Studios",
    headline: "Oryx Studios",
    subline: "Un studios de création visuelle.",
    detail: "Spécialisé dans le developpement d'identité de marque",
    accent: "#7dd3fc",
  },
  {
    id: 2,
    type: "image",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80",
    tag: "Portrait",
    headline: "Chaque regard",
    subline: "raconte une histoire.",
    detail: "Séances portraits & identité visuelle",
    accent: "#7dd3fc",
  },
  {
    id: 3,
    type: "image",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=80",
    tag: "Événement",
    headline: "L'instant",
    subline: "figé pour l'éternité.",
    detail: "Couverture événements & cérémonies",
    accent: "#93c5fd",
  },
  {
    id: 4,
    type: "image",
    image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=1600&q=80",
    tag: "Corporate",
    headline: "Votre image,",
    subline: "notre expertise.",
    detail: "Photographie corporate & branding",
    accent: "#bfdbfe",
  },
  {
    id: 5,
    type: "image",
    image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=1600&q=80",
    tag: "Éditorial",
    headline: "La lumière",
    subline: "comme langage.",
    detail: "Shoots éditoriaux & mode",
    accent: "#60a5fa",
  },


];

// Zone modifiée : tempo premium conservé avec un slide assez lent.
const DURATION = 9200;
const TRANSITION_DURATION = 4000;
const TEXT_REVEAL_DELAY = TRANSITION_DURATION + 180;

export default function PhotoHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  const goTo = useCallback((index) => {
    if (animating || index === current) return;
    setPrev(current);
    setAnimating(true);
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = performance.now();
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, TRANSITION_DURATION);
  }, [animating, current]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        next();
        startTimeRef.current = performance.now();
      }
      progressRef.current = requestAnimationFrame(tick);
    };

    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, animating, next]);

  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  // Zone modifiée : le slider accepte maintenant une vidéo MP4 en premier slide.
  const renderSlideMedia = (item, isActive = false) => {
    if (item.type === "video") {
      return (
        <video
          className="photo-slider-media"
          autoPlay={isActive}
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={item.video} type="video/mp4" />
        </video>
      );
    }

    return <img src={item.image} alt={item.tag} className="photo-slider-media" />;
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        background: "#03143a",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

        /* Zone modifiée : média commun aux images et à la vidéo du premier slide. */
        .photo-slider-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          will-change: transform, opacity, filter;
          animation: premiumImageScale ${DURATION}ms ease-in-out forwards;
        }

        /* Zone modifiée : la nouvelle slide arrive depuis l'extrême droite jusqu'au centre. */
        .photo-slider-enter {
          animation: slideInFromRight ${TRANSITION_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* Zone modifiée : l'ancienne slide quitte complètement l'écran vers l'extrême gauche. */
        .photo-slider-exit {
          animation: slideOutToLeft ${TRANSITION_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 1; filter: blur(0); }
          to { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes slideOutToLeft {
          from { transform: translateX(0) scale(1); opacity: 1; filter: blur(0); }
          to { transform: translateX(-100%); opacity: 1; filter: blur(0); }
        }

        @keyframes premiumImageScale {
          from { transform: scale(1.04); }
          to { transform: scale(1.08); }
        }

        /* Zone modifiée : le texte attend que le média soit totalement en place avant d'apparaitre. */
        .text-enter { animation: textUp 1.15s cubic-bezier(0.16,1,0.3,1) both; }
        .text-enter-delay { animation: textUp 1.15s ${TEXT_REVEAL_DELAY}ms cubic-bezier(0.16,1,0.3,1) both; }
        .text-enter-delay2 { animation: textUp 1.15s ${TEXT_REVEAL_DELAY + 180}ms cubic-bezier(0.16,1,0.3,1) both; }

        @keyframes textUp {
          from { opacity: 0; transform: translateY(34px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-dot {
          cursor: pointer;
          transition: all 0.8s cubic-bezier(0.16,1,0.3,1);
        }

        .nav-dot:hover {
          transform: scale(1.35);
          background: #dbeafe !important;
        }

        @media (max-width: 768px) {
          .photo-slider-content {
            left: 6% !important;
            right: 6% !important;
            max-width: none !important;
          }

          .photo-slider-title {
            font-size: 42px !important;
          }

          .photo-slider-copy {
            font-size: 16px !important;
          }
        }
      `}</style>

      
      {prevSlide && (
        <div key={`exit-${prev}`} className="photo-slider-exit" style={{ position: "absolute", inset: 0 }}>
          {renderSlideMedia(prevSlide)}
        </div>
      )}


      <div key={`enter-${current}`} className="photo-slider-enter" style={{ position: "absolute", inset: 0 }}>
        {renderSlideMedia(slide, true)}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E\")",
          opacity: 0.45,
        }}
      />

      <div
        className="photo-slider-content"
        style={{
          position: "absolute",
          left: "7%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          maxWidth: "48%",
          textShadow: "0 18px 46px rgba(0,0,0,0.62)",
        }}
      >
        <h1
          className="photo-slider-title text-enter text-enter-delay"
          style={{
            color: "#fff",
            fontSize: 58,
            lineHeight: 1.04,
            marginTop: 12,
            fontWeight: 700,
            letterSpacing: 0,
          }}
        >
          {slide.headline}
          <br /> <span style={{ color: "#dbeafe" }}>{slide.subline}</span>
        </h1>
        <p
          className="photo-slider-copy text-enter text-enter-delay2"
          style={{
            color: "rgba(255,255,255,0.94)",
            fontSize: 19,
            lineHeight: 1.65,
            marginTop: 20,
            fontWeight: 700,
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {slide.detail}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "block",
              color: "#fff",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 36,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {String(current + 1).padStart(2, "0")}
          </span>
          <div style={{ width: 1, height: 24, background: "rgba(219,234,254,0.55)", margin: "6px auto" }} />
          <span
            style={{
              display: "block",
              color: "rgba(219,234,254,0.62)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 500,
            }}
          >
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="nav-dot"
              aria-label={`Afficher la slide ${i + 1}`}
              style={{
                width: 3,
                height: i === current ? 32 : 14,
                background: i === current ? slide.accent : "rgba(219,234,254,0.45)",
                border: "none",
                padding: 0,
                borderRadius: 999,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(219,234,254,0.18)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #2563eb, #7dd3fc)",
            width: `${progress}%`,
            transition: "width 0.16s linear",
          }}
        />
      </div>
    </section>
  );
}
