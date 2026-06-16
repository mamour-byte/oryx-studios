"use client";

import { useEffect, useRef } from "react";

const hoverSelectors = "a, button, [role='button'], input[type='button'], input[type='submit'], input[type='reset'], summary";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const target = event.target;

      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;
      dot.style.opacity = "1";
      ring.style.opacity = "0.5";

      const isHovered = target instanceof Element && !!target.closest(hoverSelectors);
      dot.classList.toggle("cursor-hover", isHovered);
      ring.classList.toggle("cursor-hover", isHovered);

      if (isHovered) {
        ring.style.width = "48px";
        ring.style.height = "48px";
      } else {
        ring.style.width = "36px";
        ring.style.height = "36px";
      }
    };

    const onMouseLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("blur", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("blur", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
