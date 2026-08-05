"use client";

import { useState } from "react";

interface Props {
  src: string;
  blur?: string;
  alt: string;
  className?: string;
}

export default function LazyImage({ src, blur, alt, className = "" }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blur placeholder */}
      {blur && !loaded && (
        <img
          src={blur}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: "blur(12px)" }}
        />
      )}
      {/* Real image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
