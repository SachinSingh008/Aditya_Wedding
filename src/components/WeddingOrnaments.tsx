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

/**
 * Royal maroon & antique-gold velvet curtains tied back at the center with a golden rope.
 */
export function StageCurtains() {
  return (
    <div className="stage-curtains" aria-hidden="true">
      <div className="stage-curtain stage-curtain--left">
        <div className="curtain-body">
          <span className="curtain-folds" />
          <span className="curtain-sheen" />
          <span className="curtain-pinch-shadow" />
        </div>
        {/* Golden tie-back rope wrapping the gathered center + hanging tassel */}
        <svg className="curtain-tieback" viewBox="0 0 100 120" fill="none">
          <defs>
            <linearGradient id="gold-rope-l" x1="0" y1="0" x2="100" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b6914" />
              <stop offset="45%" stopColor="#f3d882" />
              <stop offset="75%" stopColor="#c49a43" />
              <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>
          </defs>
          {/* Braided rope wrapping from outer edge around gathered waist */}
          <path
            d="M0 18 C22 24, 46 32, 62 36 C44 42, 20 42, 0 38"
            stroke="url(#gold-rope-l)"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M2 21 C24 27, 46 34, 60 36"
            stroke="#fff4cc"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Knot & swinging tassel */}
          <g className="curtain-tassel-group">
            <circle cx="62" cy="36" r="6" fill="url(#gold-rope-l)" stroke="#6b4e0d" strokeWidth="1" />
            <path d="M62 42 C67 51, 67 59, 62 65 C57 59, 57 51, 62 42 Z" fill="url(#gold-rope-l)" />
            <circle cx="62" cy="68" r="4" fill="#e8c96a" stroke="#8b6914" strokeWidth="1.2" />
            <path
              d="M58 72 L55 106 M60.5 72 L59 109 M63.5 72 L65 109 M66 72 L69 106"
              stroke="url(#gold-rope-l)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="stage-curtain stage-curtain--right">
        <div className="curtain-body">
          <span className="curtain-folds" />
          <span className="curtain-sheen" />
          <span className="curtain-pinch-shadow" />
        </div>
        {/* Mirrored golden tie-back rope + hanging tassel */}
        <svg className="curtain-tieback" viewBox="0 0 100 120" fill="none">
          <defs>
            <linearGradient id="gold-rope-r" x1="100" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b6914" />
              <stop offset="45%" stopColor="#f3d882" />
              <stop offset="75%" stopColor="#c49a43" />
              <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>
          </defs>
          <path
            d="M100 18 C78 24, 54 32, 38 36 C56 42, 80 42, 100 38"
            stroke="url(#gold-rope-r)"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M98 21 C76 27, 54 34, 40 36"
            stroke="#fff4cc"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <g className="curtain-tassel-group">
            <circle cx="38" cy="36" r="6" fill="url(#gold-rope-r)" stroke="#6b4e0d" strokeWidth="1" />
            <path d="M38 42 C43 51, 43 59, 38 65 C33 59, 33 51, 38 42 Z" fill="url(#gold-rope-r)" />
            <circle cx="38" cy="68" r="4" fill="#e8c96a" stroke="#8b6914" strokeWidth="1.2" />
            <path
              d="M34 72 L31 106 M36.5 72 L35 109 M39.5 72 L41 109 M42 72 L45 106"
              stroke="url(#gold-rope-r)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * Traditional Indian marigold, rose & mango-leaf toran garland hung below the top bar.
 */
export function TopGarland() {
  return (
    <div className="top-garland" aria-hidden="true">
      <svg className="top-garland-svg" width="100%" height="64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Realistic ruffled marigold shading */}
          <radialGradient id="marigold-orange" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFD25A" />
            <stop offset="48%" stopColor="#F09819" />
            <stop offset="85%" stopColor="#C85A0E" />
            <stop offset="100%" stopColor="#8F3806" />
          </radialGradient>
          <radialGradient id="marigold-yellow" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF08A" />
            <stop offset="52%" stopColor="#F7BE2B" />
            <stop offset="88%" stopColor="#D48411" />
            <stop offset="100%" stopColor="#9C5506" />
          </radialGradient>
          <radialGradient id="rose-crimson" cx="36%" cy="34%" r="68%">
            <stop offset="0%" stopColor="#E66480" />
            <stop offset="45%" stopColor="#A61B3D" />
            <stop offset="88%" stopColor="#651026" />
            <stop offset="100%" stopColor="#3F0817" />
          </radialGradient>
          <linearGradient id="mango-leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2F7A5B" />
            <stop offset="55%" stopColor="#174B3A" />
            <stop offset="100%" stopColor="#0D2F24" />
          </linearGradient>
          <radialGradient id="mogra-pearl" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F5E9D0" />
            <stop offset="100%" stopColor="#C9B38C" />
          </radialGradient>

          {/* Reusable ruffled marigold flower */}
          <g id="genda-orange">
            <path
              d="M0,-8.5 C2.2,-8.5 3.5,-6.5 4.8,-7.2 C6.2,-7.9 7.8,-5.8 7,-4.2 C6.4,-2.8 8.5,-1.8 8.5,0 C8.5,1.8 6.4,2.8 7,4.2 C7.8,5.8 6.2,7.9 4.8,7.2 C3.5,6.5 2.2,8.5 0,8.5 C-2.2,8.5 -3.5,6.5 -4.8,7.2 C-6.2,7.9 -7.8,5.8 -7,4.2 C-6.4,2.8 -8.5,1.8 -8.5,0 C-8.5,-1.8 -6.4,-2.8 -7,-4.2 C-7.8,-5.8 -6.2,-7.9 -4.8,-7.2 C-3.5,-6.5 -2.2,-8.5 0,-8.5 Z"
              fill="url(#marigold-orange)"
              stroke="#7A2E04"
              strokeWidth="0.45"
            />
            <path
              d="M0,-5.4 C1.5,-5.4 2.5,-4.2 3.5,-4.6 C4.4,-5 5.4,-3.5 4.7,-2.4 C4.3,-1.6 5.4,-0.9 5.4,0 C5.4,0.9 4.3,1.6 4.7,2.4 C5.4,3.5 4.4,5 3.5,4.6 C2.5,4.2 1.5,5.4 0,5.4 C-1.5,5.4 -2.5,4.2 -3.5,4.6 C-4.4,5 -5.4,3.5 -4.7,2.4 C-4.3,1.6 -5.4,0.9 -5.4,0 C-5.4,-0.9 -4.3,-1.6 -4.7,-2.4 C-5.4,-3.5 -4.4,-5 -3.5,-4.6 C-2.5,-4.2 -1.5,-5.4 0,-5.4 Z"
              fill="#FFBE3D"
              opacity="0.72"
            />
            <circle cx="0" cy="0" r="2.1" fill="#8F3806" opacity="0.82" />
            <circle cx="-0.5" cy="-0.5" r="0.9" fill="#FFD970" opacity="0.7" />
          </g>

          <g id="genda-yellow">
            <path
              d="M0,-7.8 C2,-7.8 3.2,-6 4.4,-6.6 C5.7,-7.2 7.2,-5.3 6.4,-3.8 C5.9,-2.5 7.8,-1.6 7.8,0 C7.8,1.6 5.9,2.5 6.4,3.8 C7.2,5.3 5.7,7.2 4.4,6.6 C3.2,6 2,7.8 0,7.8 C-2,7.8 -3.2,6 -4.4,6.6 C-5.7,7.2 -7.2,5.3 -6.4,3.8 C-5.9,2.5 -7.8,1.6 -7.8,0 C-7.8,-1.6 -5.9,-2.5 -6.4,-3.8 C-7.2,-5.3 -5.7,-7.2 -4.4,-6.6 C-3.2,-6 -2,-7.8 0,-7.8 Z"
              fill="url(#marigold-yellow)"
              stroke="#8F5106"
              strokeWidth="0.45"
            />
            <circle cx="0" cy="0" r="2.2" fill="#B5650B" opacity="0.75" />
            <circle cx="-0.4" cy="-0.4" r="1" fill="#FFF3A1" opacity="0.85" />
          </g>

          <g id="rose-bloom">
            <circle cx="0" cy="0" r="6.2" fill="url(#rose-crimson)" stroke="#3B0715" strokeWidth="0.4" />
            <path
              d="M-3.5,-1.2 C-2,-4 2.5,-4 3.6,-1.2 C4.5,1.4 2,4.2 -0.5,3.8 C-3.2,3.4 -4.5,0.8 -3.5,-1.2 Z"
              fill="#C73458"
              opacity="0.85"
            />
            <path d="M-1.8,-0.8 C-0.4,-2.2 1.8,-1.6 1.6,0.2 C1.4,1.8 -0.8,2 -1.6,0.8" stroke="#F49CAE" strokeWidth="0.75" fill="none" opacity="0.8" />
          </g>

          <pattern id="toran-garland-pattern" width="144" height="64" patternUnits="userSpaceOnUse">
            {/* Golden silk cord */}
            <path d="M0 2 Q72 34 144 2" stroke="#C49A43" strokeWidth="2.2" fill="none" />

            {/* Lush mango leaves tucked behind blooms */}
            <g transform="translate(18, 9) rotate(-18)">
              <path d="M0 0 C5 6, 5 15, 0 21 C-5 15, -5 6, 0 0 Z" fill="url(#mango-leaf)" />
              <path d="M0 2 L0 19" stroke="#5EA886" strokeWidth="0.6" opacity="0.65" />
            </g>
            <g transform="translate(46, 19) rotate(-8)">
              <path d="M0 0 C4.5 5, 4.5 14, 0 19 C-4.5 14, -4.5 5, 0 0 Z" fill="url(#mango-leaf)" />
              <path d="M0 2 L0 17" stroke="#5EA886" strokeWidth="0.6" opacity="0.65" />
            </g>
            <g transform="translate(98, 19) rotate(8)">
              <path d="M0 0 C4.5 5, 4.5 14, 0 19 C-4.5 14, -4.5 5, 0 0 Z" fill="url(#mango-leaf)" />
              <path d="M0 2 L0 17" stroke="#5EA886" strokeWidth="0.6" opacity="0.65" />
            </g>
            <g transform="translate(126, 9) rotate(18)">
              <path d="M0 0 C5 6, 5 15, 0 21 C-5 15, -5 6, 0 0 Z" fill="url(#mango-leaf)" />
              <path d="M0 2 L0 19" stroke="#5EA886" strokeWidth="0.6" opacity="0.65" />
            </g>

            {/* Center hanging ladi (jasmine pearls + rose + marigold + gold bell) */}
            <line x1="72" y1="22" x2="72" y2="55" stroke="#C49A43" strokeWidth="1.2" />
            <circle cx="72" cy="31" r="2.3" fill="url(#mogra-pearl)" />
            <circle cx="72" cy="37" r="2.3" fill="url(#mogra-pearl)" />
            <use href="#rose-bloom" transform="translate(72, 44.5) scale(0.75)" />
            <path d="M72 50 L68.5 57.5 L75.5 57.5 Z" fill="#E8C96A" stroke="#8B6914" strokeWidth="0.6" />
            <circle cx="72" cy="58.5" r="1.7" fill="#C49A43" />

            {/* Peak hanging ladi (split at x=0 and x=144 for seamless repeat) */}
            <line x1="0" y1="2" x2="0" y2="38" stroke="#C49A43" strokeWidth="1.2" />
            <circle cx="0" cy="14" r="2.2" fill="url(#mogra-pearl)" />
            <circle cx="0" cy="20" r="2.2" fill="url(#mogra-pearl)" />
            <circle cx="0" cy="26" r="2.2" fill="url(#mogra-pearl)" />
            <path d="M0 31 L-3.2 38 L3.2 38 Z" fill="#E8C96A" stroke="#8B6914" strokeWidth="0.5" />
            <line x1="144" y1="2" x2="144" y2="38" stroke="#C49A43" strokeWidth="1.2" />
            <circle cx="144" cy="14" r="2.2" fill="url(#mogra-pearl)" />
            <circle cx="144" cy="20" r="2.2" fill="url(#mogra-pearl)" />
            <circle cx="144" cy="26" r="2.2" fill="url(#mogra-pearl)" />
            <path d="M144 31 L140.8 38 L147.2 38 Z" fill="#E8C96A" stroke="#8B6914" strokeWidth="0.5" />

            {/* Dense overlapping floral swag */}
            <use href="#genda-orange" transform="translate(11, 5.5) scale(0.95)" />
            <use href="#genda-yellow" transform="translate(24, 10.5) scale(0.92)" />
            <use href="#rose-bloom" transform="translate(37, 14.5) scale(0.95)" />
            <use href="#genda-yellow" transform="translate(50, 18) scale(1.02)" />
            <use href="#genda-orange" transform="translate(62, 20.5) scale(1.05)" />
            <use href="#genda-orange" transform="translate(82, 20.5) scale(1.05)" />
            <use href="#genda-yellow" transform="translate(94, 18) scale(1.02)" />
            <use href="#rose-bloom" transform="translate(107, 14.5) scale(0.95)" />
            <use href="#genda-yellow" transform="translate(120, 10.5) scale(0.92)" />
            <use href="#genda-orange" transform="translate(133, 5.5) scale(0.95)" />
            {/* Center hero marigold */}
            <use href="#genda-yellow" transform="translate(72, 21.5) scale(1.18)" />
            {/* Peak rosettes */}
            <use href="#rose-bloom" transform="translate(0, 4.5) scale(0.92)" />
            <use href="#rose-bloom" transform="translate(144, 4.5) scale(0.92)" />
          </pattern>
        </defs>
        <rect width="100%" height="64" fill="url(#toran-garland-pattern)" />
      </svg>
    </div>
  );
}

const BURST_SHOWER_ITEMS = Array.from({ length: 64 }, (_, i) => {
  const kinds = ["petal", "marigold-orange", "petal", "rose", "marigold-yellow", "petal"] as const;
  const kind = kinds[i % kinds.length];
  // Deterministic spread across 0s..1.0s launch window
  const delay = ((i * 17) % 100) / 100;
  const duration = 2.1 + ((i * 13) % 15) / 10;
  const left = 2 + ((i * 29 + (i % 5) * 7) % 96);
  const drift = (((i * 19) % 80) - 40);
  const scale = 0.78 + ((i * 11) % 6) * 0.1;
  return { id: `burst-${i}`, kind, delay, duration, left, drift, scale };
});

/**
 * Celebratory 1-second Pushpa Varsha burst when the temple doors open,
 * naturally thinning out back to the ambient page petals.
 */
export function DoorPetalShower({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="door-petal-shower" aria-hidden="true">
      {BURST_SHOWER_ITEMS.map((item) => (
        <span
          key={item.id}
          className={`burst-particle burst-particle--${item.kind}`}
          style={
            {
              left: `${item.left}%`,
              animationDelay: `${item.delay.toFixed(2)}s`,
              animationDuration: `${item.duration.toFixed(2)}s`,
              "--burst-drift": `${item.drift}px`,
              "--burst-scale": item.scale,
            } as React.CSSProperties
          }
        >
          {item.kind === "marigold-orange" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6.2" r="4.3" fill="#E89B2D" />
              <circle cx="17.5" cy="10.2" r="4.3" fill="#F2B138" />
              <circle cx="15.4" cy="16.7" r="4.3" fill="#E89B2D" />
              <circle cx="8.6" cy="16.7" r="4.3" fill="#F2B138" />
              <circle cx="6.5" cy="10.2" r="4.3" fill="#E89B2D" />
              <circle cx="12" cy="12" r="3" fill="#9E4710" />
            </svg>
          ) : item.kind === "marigold-yellow" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="6.2" r="4.2" fill="#F7BE2B" />
              <circle cx="17.5" cy="10.2" r="4.2" fill="#FFD95E" />
              <circle cx="15.4" cy="16.7" r="4.2" fill="#F7BE2B" />
              <circle cx="8.6" cy="16.7" r="4.2" fill="#FFD95E" />
              <circle cx="6.5" cy="10.2" r="4.2" fill="#F7BE2B" />
              <circle cx="12" cy="12" r="2.8" fill="#B5650B" />
            </svg>
          ) : item.kind === "rose" ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4 C15.8 4, 18.8 7, 18.8 10.6 C18.8 14.6, 14.6 18.6, 12 20 C9.4 18.6, 5.2 14.6, 5.2 10.6 C5.2 7, 8.2 4, 12 4 Z"
                fill="#A61D3D"
              />
              <path
                d="M12 6.8 C14 6.8, 15.6 8.4, 15.6 10.4 C15.6 12.6, 13.5 14.8, 12 15.8 C10.5 14.8, 8.4 12.6, 8.4 10.4 C8.4 8.4, 10 6.8, 12 6.8 Z"
                fill="#DE5D79"
              />
            </svg>
          ) : (
            <span className="burst-petal-shape" />
          )}
        </span>
      ))}
    </div>
  );
}
