"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Slide {
  img: string;
  title: string;
  slug: string;
}

const NAV_HEIGHT = 80;
const SWIPE_THRESHOLD = 50;

const slides: Slide[] = [
  {
    img: "https://picsum.photos/id/1011/1600/900",
    title: "PHOTOGRAPHIE",
    slug: "/services/photos",
  },
  {
    img: "https://picsum.photos/id/1016/1600/900",
    title: "MONTAGE VIDÉO",
    slug: "/services/montage",
  },
  {
    img: "https://picsum.photos/id/1015/1600/900",
    title: "FILMS",
    slug: "/services/films",
  },
  {
    img: "https://picsum.photos/id/1015/1600/900",
    title: "IMAGES DRONES",
    slug: "/services/imageaerienne",
  },
  {
    img: "https://picsum.photos/id/1025/1600/900",
    title: "GRAPHISME",
    slug: "/services/graphisme",
  },
  {
    img: "https://picsum.photos/id/1062/1600/900",
    title: "PRINTS",
    slug: "/services/prints",
  },
  {
    img: "https://picsum.photos/id/1035/1600/900",
    title: "MOTION DESIGN",
    slug: "/services/motion",
  },
  {
    img: "https://picsum.photos/id/1045/1600/900",
    title: "PLAN 3D",
    slug: "/services/plan",
  },
];

export default function Slider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const [pos, setPos] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [overlay, setOverlay] = useState<{
    active: boolean;
    slide: Slide | null;
  }>({
    active: false,
    slide: null,
  });

  /* ======================
     RESPONSIVE
  ====================== */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const slideWidth =
    typeof window !== "undefined"
      ? isMobile
        ? window.innerWidth
        : window.innerWidth / 3
      : 0;

  /* ======================
     AUTO SCROLL DESKTOP
  ====================== */
  useEffect(() => {
    if (isMobile) return;

    let raf: number;
    const speed = 0.35;

    const animate = () => {
      setPos((prev) => {
        let next = prev + speed;
        if (sliderRef.current && next >= sliderRef.current.scrollWidth / 2) {
          next = 0;
        }
        return next;
      });
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  /* ======================
     APPLY TRANSFORM
  ====================== */
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${pos}px)`;
    }
  }, [pos]);

  const handlePrev = () =>
    setPos((p) => Math.max(p - slideWidth, 0));

  const handleNext = () =>
    setPos((p) => p + slideWidth);

  /* ======================
     SWIPE MOBILE
  ====================== */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff =
      touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? handleNext() : handlePrev();
    }

    touchStartX.current = null;
  };

  return (
    <section className="relative">
      <div
        className="relative h-screen overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* NAV BUTTONS */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 md:w-14 md:h-14
                     rounded-full bg-black/40 backdrop-blur
                     text-white text-xl md:text-2xl
                     hover:bg-black/60 transition"
        >
          ‹
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30
                     w-12 h-12 md:w-14 md:h-14
                     rounded-full bg-black/40 backdrop-blur
                     text-white text-xl md:text-2xl
                     hover:bg-black/60 transition"
        >
          ›
        </button>

        {/* SLIDER */}
        <div ref={sliderRef} className="flex h-full will-change-transform">
          {slides.concat(slides).map((slide, idx) => (
            <div
              key={idx}
              className={`relative h-full ${
                isMobile ? "min-w-full" : "min-w-[33.333vw]"
              }`}
              onClick={() => {
                if (!isMobile) {
                  setOverlay({ active: true, slide });
                }
              }}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute bottom-24 left-8 md:left-12 text-white max-w-md">
                <h2 className="text-2xl md:text-3xl font-bold mb-5 drop-shadow-xl">
                  {slide.title}
                </h2>

                {isMobile && (
                  <Link
                    href={slide.slug}
                    className="inline-flex px-7 py-3
                               border border-white rounded-full
                               text-sm backdrop-blur
                               hover:bg-white hover:text-black transition"
                  >
                    Explorer le service
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY DESKTOP */}
      {overlay.active && overlay.slide && (
        <div
          className="fixed left-0 right-0 bg-black/90 z-40"
          style={{
            top: NAV_HEIGHT,
            height: `calc(100vh - ${NAV_HEIGHT}px)`,
          }}
        >
          <button
            onClick={() => setOverlay({ active: false, slide: null })}
            className="absolute top-6 left-6 w-12 h-12
                       border border-white rounded-full
                       text-white text-xl
                       flex items-center justify-center
                       hover:bg-white hover:text-black transition z-50"
          >
            ✕
          </button>

          <div className="relative w-full h-full">
            <img
              src={overlay.slide.img}
              alt={overlay.slide.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-28 left-8 md:left-16 text-white max-w-md">
              <h1 className="text-4xl font-bold mb-8">
                {overlay.slide.title}
              </h1>

              <Link
                href={overlay.slide.slug}
                className="inline-flex px-8 py-3
                           border border-white rounded-full
                           hover:bg-white hover:text-black transition"
              >
                Explorer le service
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
