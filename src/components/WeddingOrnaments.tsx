import { Flower2, Heart, Sparkles } from "lucide-react";
import { useState } from "react";

interface WeddingImageProps {
  src: string;
  alt: string;
  fallbackGradient: string;
  className?: string;
  priority?: boolean;
}

/**
 * Lazy-loaded photographic frame with a graceful luxury gradient fallback
 * if an image fails to load or is temporarily unavailable.
 */
export function WeddingImage({
  src,
  alt,
  fallbackGradient,
  className = "",
  priority = false,
}: WeddingImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`wedding-image-wrap ${className}`} style={{ background: fallbackGradient }}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onError={() => setFailed(true)}
          className="wedding-image-img"
        />
      ) : null}
    </div>
  );
}

/**
 * Traditional Indian mandala motif rendered as a subtle ornamental SVG.
 */
export function MandalaWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={`mandala-svg ${className}`}
    >
      <circle
        cx="100"
        cy="100"
        r="92"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="3 4"
      />
      <circle cx="100" cy="100" r="74" stroke="currentColor" strokeWidth="0.7" />
      <circle
        cx="100"
        cy="100"
        r="52"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="2 3"
      />
      <circle cx="100" cy="100" r="28" stroke="currentColor" strokeWidth="0.8" />
      {Array.from({ length: 12 }, (_, idx) => {
        const angle = idx * 30;
        return (
          <g key={angle} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100 14 C107 34, 107 52, 100 68 C93 52, 93 34, 100 14 Z"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <circle cx="100" cy="8" r="1.6" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Animated floral & gold filigree section divider.
 */
export function FloralDivider({ variant = "gold" }: { variant?: "gold" | "light" }) {
  return (
    <div className={`floral-divider floral-divider--${variant}`} aria-hidden="true">
      <span className="floral-divider-line" />
      <Sparkles className="floral-divider-spark" />
      <span className="floral-divider-gem">
        <Flower2 />
      </span>
      <Sparkles className="floral-divider-spark" />
      <span className="floral-divider-line" />
    </div>
  );
}

const PETAL_ITEMS = [
  { id: "p1", left: "8%", delay: "0s", duration: "13s", kind: "petal" as const },
  { id: "p2", left: "22%", delay: "2.4s", duration: "15s", kind: "sparkle" as const },
  { id: "p3", left: "38%", delay: "5.1s", duration: "12s", kind: "petal" as const },
  { id: "p4", left: "54%", delay: "1.3s", duration: "16s", kind: "heart" as const },
  { id: "p5", left: "71%", delay: "3.7s", duration: "14s", kind: "petal" as const },
  { id: "p6", left: "86%", delay: "6.2s", duration: "13s", kind: "sparkle" as const },
  { id: "p7", left: "93%", delay: "4.1s", duration: "15s", kind: "petal" as const },
];

/**
 * Delicate floating rose petals, subtle gold sparkles, and gentle hearts.
 * Disabled automatically when user prefers reduced motion.
 */
export function FloatingAtmosphere({ variant = "hero" }: { variant?: "hero" | "romantic" }) {
  return (
    <div className={`floating-atmosphere floating-atmosphere--${variant}`} aria-hidden="true">
      {PETAL_ITEMS.map((item) => (
        <span
          key={item.id}
          className={`float-particle float-particle--${item.kind}`}
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.kind === "heart" ? (
            <Heart />
          ) : item.kind === "sparkle" ? (
            <Sparkles />
          ) : (
            <span className="rose-petal-shape" />
          )}
        </span>
      ))}
    </div>
  );
}
