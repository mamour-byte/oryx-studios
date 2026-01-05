"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxSectionProps = {
  children: React.ReactNode;
  speed?: number;
};

export default function ParallaxSection({
  children,
  speed = 0.3,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100]
  );

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
