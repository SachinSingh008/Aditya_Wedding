import type { EventKey } from "./weddingConfig";

export interface ImageAsset {
  src: string;
  fallbackGradient: string;
  altHi: string;
  altEn: string;
}

/**
 * Centralized wedding image configuration.
 * Replace any `src` path with your own optimized WebP/AVIF/JPG asset in `public/images/`.
 * Couple portrait photographs remain null in `weddingConfig.photographs` until real photos are provided.
 */
export const weddingImages = {
  heroBackground: {
    src: "/images/hero-mandap.jpg",
    fallbackGradient: "radial-gradient(ellipse at 50% 42%, #65152D 0%, #3B1020 68%, #220711 100%)",
    altHi: "पुष्प सज्जा और सुनहरी रोशनी से सजा भव्य भारतीय विवाह मंडप",
    altEn: "Luxurious Indian wedding mandap adorned with marigold, roses, and warm golden lights",
  },
  ganeshBlessingBackdrop: {
    src: "/images/event-ashtayam.jpg",
    fallbackGradient: "linear-gradient(135deg, #FFF9EF 0%, #F5E9D0 55%, #E9C9C5 100%)",
    altHi: "दीपों और पुष्पों से सजी मंगल पूजा की झलक",
    altEn: "Warm brass diyas and sacred floral arrangement for Ganesh Vandana",
  },
  baratConvoy: {
    src: "/images/barat-convoy.jpg",
    fallbackGradient: "linear-gradient(135deg, #3B1020 0%, #65152D 50%, #C49A43 100%)",
    altHi: "ताजे फूलों से सजी बारात प्रस्थान की गाड़ी",
    altEn: "Wedding car adorned with fresh marigolds and roses for the Baraat departure",
  },
  venueBackdrop: {
    src: "/images/event-vivah.jpg",
    fallbackGradient: "linear-gradient(135deg, #F5E9D0 0%, #E9C9C5 60%, #FFF9EF 100%)",
    altHi: "फूलों और झूमरों से सजा विवाह स्थल मंडप",
    altEn: "Floral Indian wedding mandap decoration",
  },
  events: {
    "akhand-ashtayam": {
      src: "/images/event-ashtayam.jpg",
      fallbackGradient: "linear-gradient(145deg, #3B1020, #65152D)",
      altHi: "अखण्ड अष्टयाम के लिए कलश और प्रज्वलित दीप",
      altEn: "Sacred kalash and glowing brass oil diyas for Akhand Ashtayam",
    },
    tilak: {
      src: "/images/event-tilak.jpg",
      fallbackGradient: "linear-gradient(145deg, #65152D, #8A243E)",
      altHi: "शुभ तिलक समारोह की सजी हुई पूजा थाली",
      altEn: "Ornate brass thali with kumkum, rice, and marigold petals for Tilak",
    },
    matkor: {
      src: "/images/event-matkor.jpg",
      fallbackGradient: "linear-gradient(145deg, #174B3A, #3B1020)",
      altHi: "कथा मटकोर की पारम्परिक बिहार रस्म का कलश और पुष्प",
      altEn: "Traditional Bihar Katha Matkor earthen kalash with mango leaves and flowers",
    },
    wedding: {
      src: "/images/event-vivah.jpg",
      fallbackGradient: "linear-gradient(145deg, #3B1020, #65152D)",
      altHi: "शुभ विवाह के लिए पुष्पों से सजा भव्य मंडप",
      altEn: "Grand floral wedding mandap illuminated with warm chandeliers for Shubh Vivah",
    },
  } satisfies Record<EventKey, ImageAsset>,
} as const;
