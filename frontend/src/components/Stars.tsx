import { useEffect, useState, type CSSProperties } from "react";

interface Star {
  id: number;
  topOffset: string;
  leftOffset: string;
  tailLength: string;
  fallDuration: string;
}

const createStars = (density: number): Star[] => {
  let hasTouchScreen = false;
  const nav = navigator;
  if ("maxTouchPoints" in nav) {
    hasTouchScreen = nav.maxTouchPoints > 0;
  } else {
    const UA = navigator.userAgent;
    hasTouchScreen =
      /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
  }

  if (!hasTouchScreen) {
    const starCount = Math.max(25, Math.round((window.innerWidth / 55) * density));
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      const randomLeftOffset = 80 + Math.random() * 60;
      const randomTopOffset = -20 + Math.random() * 140;
      const randomTailLength = 5 + Math.random() * 2.5;
      const randomFallDuration = 6 + Math.random() * 6;

      newStars.push({
        id: i,
        topOffset: `${randomTopOffset}vh`,
        leftOffset: `${randomLeftOffset}vw`,
        tailLength: `${randomTailLength}em`,
        fallDuration: `${randomFallDuration}s`,
      });
    }
    return newStars;
  }
  return [];
};

interface StarsProps {
  /** Multiplier for the auto-calculated star count. Default 1. Use < 1 for sparser, > 1 for denser. */
  density?: number;
}

export default function Stars({ density = 1 }: StarsProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(createStars(density));
  }, [density]);

  if (stars.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[120%] -rotate-45 -z-10 stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute left-0 text-indigo-400 bg-gradient-to-tr from-current to-transparent rounded-full"
          style={
            {
              top: star.topOffset,
              width: star.tailLength,
              height: "2px",
              translate: `${star.leftOffset} 0`,
              transformOrigin: "left center",
              animation: `fall ${star.fallDuration} 0s linear infinite, tail-fade ${star.fallDuration} 0s ease-out infinite`,
              "--star-width": `calc(${star.tailLength} / 6)`,
              "--star-tail": star.tailLength,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
