import { useState, useEffect, useRef, useCallback } from "react";

const DURATION = 9200;
const TRANSITION_DURATION = 4000;
const TEXT_REVEAL_DELAY = TRANSITION_DURATION + 180;

export default function PhotoHeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    fetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.slider?.length > 0) {
          setSlides(data.slider);
        }
      })
      .catch((err) => console.error("Error fetching slider:", err))
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((index) => {
    if (animating || index === current || slides.length === 0) return;
    setPrev(current);
    setAnimating(true);
    setCurrent(index);
    setProgress(0);
    startTimeRef.current = performance.now();
    setTimeout(() => { setPrev(null); setAnimating(false); }, TRANSITION_DURATION);
  }, [animating, current, slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    startTimeRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(p);
      if (p >= 100) { next(); startTimeRef.current = performance.now(); }
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, animating, next, slides.length]);

  const slide = slides[current] ?? null;
  const prevSlide = prev !== null ? slides[prev] ?? null : null;

  const renderMedia = (item, isActive = false) => {
    if (item.type === "video") {
      return (
        <video className="photo-slider-media" autoPlay={isActive} muted loop playsInline preload="metadata">
          <source src={item.video} type="video/mp4" />
        </video>
      );
    }
    return <img src={item.image} alt={item.tag} className="photo-slider-media" />;
  };

  if (loading) {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#03143a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!slide) return null;

  return (
    <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: 600, overflow: "hidden", background: "#03143a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
        .photo-slider-media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; will-change: transform; animation: premiumImageScale ${DURATION}ms ease-in-out forwards; }
        .photo-slider-enter { animation: slideInFromRight ${TRANSITION_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards; }
        .photo-slider-exit { animation: slideOutToLeft ${TRANSITION_DURATION}ms cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes slideInFromRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOutToLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes premiumImageScale { from { transform: scale(1.04); } to { transform: scale(1.08); } }
        .text-enter-delay { animation: textUp 1.15s ${TEXT_REVEAL_DELAY}ms cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes textUp { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .photo-slider-content { left: 6% !important; right: 6% !important; max-width: none !important; } .photo-slider-title { font-size: 42px !important; } }
      `}</style>

      {/* Chevrons */}
      {slides.length > 1 && (
        <>
          <button onClick={() => goTo((current - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", zIndex: 20, background: "transparent", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={() => goTo((current + 1) % slides.length)} style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 20, background: "transparent", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "50%", width: 48, height: 48, color: "#fff", fontSize: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </>
      )}

      {prevSlide && (
        <div key={`exit-${prev}`} className="photo-slider-exit" style={{ position: "absolute", inset: 0 }}>
          {renderMedia(prevSlide)}
        </div>
      )}

      <div key={`enter-${current}`} className="photo-slider-enter" style={{ position: "absolute", inset: 0 }}>
        {renderMedia(slide, true)}
      </div>

      {slide.headline && (
        <div className="photo-slider-content" style={{ position: "absolute", left: "7%", top: "50%", transform: "translateY(-50%)", zIndex: 10, maxWidth: "48%", textShadow: "0 18px 46px rgba(0,0,0,0.62)" }}>
          <h1 className="photo-slider-title text-enter-delay" style={{ color: "#fff", fontSize: 70, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.04, fontWeight: 700 }}>
            {slide.headline}
          </h1>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(219,234,254,0.18)", zIndex: 10 }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #2563eb, #7dd3fc)", width: `${progress}%`, transition: "width 0.16s linear" }} />
      </div>
    </section>
  );
}
