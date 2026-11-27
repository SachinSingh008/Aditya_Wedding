import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Flower2,
  Heart,
  MapPin,
  Music2,
  Pause,
  Play,
  Share2,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  DoorPetalShower,
  FloatingAtmosphere,
  FloralDivider,
  MandalaWatermark,
  StageCurtains,
  TopGarland,
  WeddingImage,
} from "@/components/WeddingOrnaments";
import { Button } from "@/components/ui/button";
import { heroSlideshowImages, weddingImages } from "@/data/imageConfig";
import {
  weddingConfig,
  weddingCopy,
  type EventKey,
  type GalleryCategory,
  type Language,
} from "@/data/weddingConfig";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aditya & Anjali | शुभ विवाह निमंत्रण" },
      {
        name: "description",
        content:
          "आदित्य कुमार सिंह एवं कुमारी अंजली के शुभ विवाह समारोह (28 नवम्बर – 03 दिसम्बर 2026, सारण, बिहार) का स्नेहपूर्ण डिजिटल निमंत्रण।",
      },
      { property: "og:title", content: "Aditya & Anjali | शुभ विवाह निमंत्रण" },
      {
        property: "og:description",
        content:
          "Join Aditya and Anjali's families for their wedding celebrations, 28 November–03 December 2026 in Saran, Bihar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingInvitation,
});

const countdownTarget = new Date(weddingConfig.wedding.targetUtc).getTime();

function getCountdown(now = Date.now()) {
  const remaining = Math.max(0, countdownTarget - now);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

const GALLERY_CATEGORIES: GalleryCategory[] = [
  "all",
  "couple",
  "family",
  "pre-wedding",
  "ceremonies",
  "moments",
];

function WeddingInvitation() {
  const [language, setLanguage] = useState<Language>("hi");
  const [introVisible, setIntroVisible] = useState(true);
  const [introOpening, setIntroOpening] = useState(false);
  const [doorShowerActive, setDoorShowerActive] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const userPausedRef = useRef(false);
  const [copiedNumber, setCopiedNumber] = useState("");
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<GalleryCategory>("all");
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroParallax, setHeroParallax] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStartX = useRef<number | null>(null);
  const copy = weddingCopy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("aditya-anjali-language");
    if (saved === "hi" || saved === "en") setLanguage(saved);
    const tick = () => setCountdown(getCountdown());
    tick();
    const timer = window.setInterval(tick, 1_000);
    const slideTimer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlideshowImages.length);
    }, 5_500);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(slideTimer);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aditya-anjali-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setHeroParallax(Math.min(72, window.scrollY * 0.16));
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (activeGallery === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGallery(null);
      if (event.key === "ArrowRight")
        setActiveGallery((current) =>
          current === null ? null : (current + 1) % weddingConfig.gallery.length,
        );
      if (event.key === "ArrowLeft")
        setActiveGallery((current) =>
          current === null
            ? null
            : (current - 1 + weddingConfig.gallery.length) % weddingConfig.gallery.length,
        );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGallery]);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !weddingConfig.audioUrl || userPausedRef.current) return;
    try {
      await audio.play();
      setMusicError(false);
      setPlaying(true);
    } catch {
      /* Autoplay blocked until user gesture; handled by first interaction listener */
    }
  };

  useEffect(() => {
    void startMusic();
    const onFirstInteraction = () => {
      if (!userPausedRef.current) {
        void startMusic();
      }
    };
    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  const openInvitation = () => {
    if (introOpening) return;
    setIntroOpening(true);
    setDoorShowerActive(true);
    void startMusic();
    window.setTimeout(() => setIntroVisible(false), 3_450);
    window.setTimeout(() => setDoorShowerActive(false), 5_800);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !weddingConfig.audioUrl) {
      setMusicError(true);
      return;
    }
    if (playing) {
      userPausedRef.current = true;
      audio.pause();
      setPlaying(false);
      return;
    }
    userPausedRef.current = false;
    try {
      await audio.play();
      setMusicError(false);
      setPlaying(true);
    } catch {
      setPlaying(false);
      setMusicError(true);
    }
  };

  const addToCalendar = (key: EventKey) => {
    const eventData = weddingConfig.events.find((item) => item.key === key);
    if (!eventData) return;
    const dateCompact = eventData.date.replaceAll("-", "");
    const startsAt =
      "startTime" in eventData && eventData.startTime
        ? `DTSTART;TZID=${weddingConfig.timezone}:${dateCompact}T${eventData.startTime.replace(":", "")}00`
        : `DTSTART;VALUE=DATE:${dateCompact}`;
    const hasDuration24 = "durationHours" in eventData && eventData.durationHours === 24;
    const nextDayCompact = new Date(new Date(`${eventData.date}T00:00:00Z`).getTime() + 86_400_000)
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");
    const endsAt =
      hasDuration24 && "startTime" in eventData && eventData.startTime
        ? `DTEND;TZID=${weddingConfig.timezone}:${nextDayCompact}T${eventData.startTime.replace(":", "")}00`
        : "startTime" in eventData && eventData.startTime
          ? `DTEND;TZID=${weddingConfig.timezone}:${dateCompact}T${String(Number(eventData.startTime.slice(0, 2)) + 1).padStart(2, "0")}${eventData.startTime.slice(3)}00`
          : `DTEND;VALUE=DATE:${nextDayCompact}`;
    const summary = language === "hi" ? eventData.titleHi : eventData.titleEn;
    const description = language === "hi" ? eventData.descriptionHi : eventData.descriptionEn;
    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Aditya and Anjali//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${eventData.key}@aditya-anjali-wedding`,
      `DTSTAMP:${new Date()
        .toISOString()
        .replaceAll(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      startsAt,
      endsAt,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${eventData.key}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const shareEvent = async (key: EventKey) => {
    const eventData = weddingConfig.events.find((item) => item.key === key);
    if (!eventData) return;
    const title = language === "hi" ? eventData.titleHi : eventData.titleEn;
    const date = language === "hi" ? eventData.dateHi : eventData.dateEn;
    const text = `${title} · ${date} · ${weddingConfig.locationShort}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: window.location.href });
      } catch {
        /* dismissed by visitor */
      }
      return;
    }
    await navigator.clipboard.writeText(`${text} · ${window.location.href}`);
    setCopiedNumber(`event-${key}`);
    window.setTimeout(() => setCopiedNumber(""), 1_800);
  };

  const copyPhone = async (phone: string) => {
    await navigator.clipboard.writeText(phone);
    setCopiedNumber(phone);
    window.setTimeout(() => setCopiedNumber(""), 1_800);
  };

  const filteredGallery = weddingConfig.gallery.filter(
    (item) => galleryCategory === "all" || item.category === galleryCategory,
  );
  const activeImage = activeGallery === null ? null : weddingConfig.gallery[activeGallery];

  return (
    <main className="wedding-page">
      <StageCurtains />
      <DoorPetalShower active={doorShowerActive} />
      {weddingConfig.audioUrl ? (
        <audio
          ref={audioRef}
          src={weddingConfig.audioUrl}
          autoPlay
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => {
            setPlaying(false);
            setMusicError(true);
          }}
        />
      ) : null}

      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Aditya and Anjali home">
          <span className="wordmark-mark">
            {/* Kissing swans forming a heart — classic wedding motif */}
            <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Left swan neck & head curving into heart arch */}
              <path
                d="M16 10.8 C14.5 7.8 10.2 7.5 9.2 11.2 C8.2 14.8 12.2 18.2 15.6 21.2 C11.8 22.2 7.2 21.8 5.2 18.8 C6.8 22.8 10.8 24.4 15.8 23.6"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right swan neck & head curving into heart arch */}
              <path
                d="M16 10.8 C17.5 7.8 21.8 7.5 22.8 11.2 C23.8 14.8 19.8 18.2 16.4 21.2 C20.2 22.2 24.8 21.8 26.8 18.8 C25.2 22.8 21.2 24.4 16.2 23.6"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Delicate heart at center */}
              <path
                d="M16 17.8 C16 17.8 13.2 15.8 13.2 14 C13.2 12.9 14.1 12.2 15 12.6 C15.5 12.8 15.8 13.3 16 13.7 C16.2 13.3 16.5 12.8 17 12.6 C17.9 12.2 18.8 12.9 18.8 14 C18.8 15.8 16 17.8 16 17.8 Z"
                fill="currentColor"
                opacity="0.9"
              />
              {/* Gentle water ripple */}
              <path
                d="M9 26.4 Q16 27.6 23 26.4"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                opacity="0.78"
              />
            </svg>
          </span>
          <span>
            Aditya <i>&amp;</i> Anjali
          </span>
        </a>
        <nav className="desktop-nav" aria-label={copy.primaryNavigation}>
          <a href="#home">{copy.navHome}</a>
          <a href="#events">{copy.navEvents}</a>
          <a href="#gallery">{copy.navGallery}</a>
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={copy.language}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={language === "hi"}
              onClick={() => setLanguage("hi")}
            >
              हिंदी
            </Button>
            <span aria-hidden="true">|</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`music-button${playing ? " is-playing" : ""}`}
            onClick={() => void toggleMusic()}
            aria-label={playing ? copy.pauseMusic : copy.playMusic}
            title={playing ? copy.pauseMusic : copy.playMusic}
          >
            {playing ? (
              <Pause aria-hidden="true" />
            ) : musicError ? (
              <Music2 aria-hidden="true" />
            ) : (
              <Play aria-hidden="true" />
            )}
          </Button>
        </div>
        <TopGarland />
      </header>

      {musicError ? (
        <p className="music-notice" role="status">
          {copy.musicUnavailable}
        </p>
      ) : null}

      <section className="hero" id="home" aria-labelledby="couple-title">
        <div
          className="hero-media"
          style={{ transform: `translate3d(0, ${heroParallax}px, 0) scale(1.06)` }}
          aria-hidden="true"
        >
          <div className="hero-slideshow">
            {heroSlideshowImages.map((slide, index) => (
              <div
                key={slide.src}
                className={`hero-slide${index === heroSlide ? " is-active" : ""}`}
              >
                <WeddingImage
                  src={slide.src}
                  alt={language === "hi" ? slide.altHi : slide.altEn}
                  fallbackGradient={slide.fallbackGradient}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <div className="hero-scrim" />
        </div>
        <FloatingAtmosphere variant="hero" />
        <div className="hero-frame" aria-hidden="true" />
        <div className="hero-ornament hero-ornament-left" aria-hidden="true">
          <MandalaWatermark />
        </div>
        <div className="hero-ornament hero-ornament-right" aria-hidden="true">
          <MandalaWatermark />
        </div>

        <div className="hero-inner">
          <p className="eyebrow hero-eyebrow">{copy.heroOverline}</p>
          <span className="hero-rule" aria-hidden="true">
            <span />
          </span>
          <h1 id="couple-title">
            <span className="hero-name-groom">{weddingConfig.groom.shortNameEn}</span>
            <Heart className="hero-heart" aria-label="and" />
            <span className="hero-name-bride">{weddingConfig.bride.shortNameEn}</span>
          </h1>
          <p className="hero-deck">{copy.heroQuote}</p>
          <p className="hero-date">
            {language === "hi" ? weddingConfig.wedding.dateHi : weddingConfig.wedding.dateEn}
          </p>
          <div className="countdown" aria-label={copy.countdownLabel}>
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <div className="countdown-unit" key={unit}>
                <span className="countdown-number">{String(countdown[unit]).padStart(2, "0")}</span>
                <span className="countdown-label">{copy.countdown[unit]}</span>
              </div>
            ))}
          </div>
          <a className="scroll-cue" href="#invitation">
            <span>{copy.scroll}</span>
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
        <p className="hero-side-note" aria-hidden="true">
          {weddingConfig.wedding.year}
        </p>
      </section>

      <section className="invitation-band" id="invitation">
        <div className="invitation-backdrop" aria-hidden="true">
          <WeddingImage
            src={weddingImages.ganeshBlessingBackdrop.src}
            alt={
              language === "hi"
                ? weddingImages.ganeshBlessingBackdrop.altHi
                : weddingImages.ganeshBlessingBackdrop.altEn
            }
            fallbackGradient={weddingImages.ganeshBlessingBackdrop.fallbackGradient}
          />
        </div>
        <div className="invitation section-wrap">
          <MandalaWatermark className="invitation-mandala" />
          <div className="invitation-mark" aria-hidden="true">
            <span>श्री</span>
          </div>
          <p className="section-kicker">{copy.invitationKicker}</p>
          <h2>{copy.invitationTitle}</h2>
          <p className="invitation-salutation">{copy.salutation}</p>
          <p className="invitation-lead">{copy.invitationOpening}</p>
          <p className="invitation-emphasis">{copy.invitationBlessing}</p>
          <div className="poetry-block">
            <p>{copy.poemLineOne}</p>
            <p>{copy.poemLineTwo}</p>
          </div>
          <div className="prayer-block">
            <p className="prayer-heading">॥ श्री गणेशाय नमः ॥</p>
            <p>{copy.prayerOne}</p>
            <p>{copy.prayerTwo}</p>
            <p>{copy.prayerThree}</p>
            <p>{copy.prayerFour}</p>
          </div>
          <p className="welcome-copy">
            {copy.welcomeOne}
            <br />
            {copy.welcomeTwo}
            <br />
            {copy.welcomeThree}
          </p>
          <FloralDivider />
        </div>
      </section>

      <section className="couple-section" id="couple">
        <FloatingAtmosphere variant="romantic" />
        <div className="section-wrap">
          <div className="section-heading">
            <p className="section-kicker">{copy.coupleKicker}</p>
            <h2>{copy.coupleTitle}</h2>
            <p>{copy.coupleDescription}</p>
          </div>
          <div className="couple-grid">
            <ProfileCard language={language} kind="groom" />
            <div className="couple-join-mark" aria-hidden="true">
              <span className="join-stem" />
              <span className="join-medallion">
                <Heart />
              </span>
              <span>03 · XII · 26</span>
              <span className="join-stem" />
            </div>
            <ProfileCard language={language} kind="bride" />
          </div>
          <FloralDivider />
        </div>
      </section>

      <section className="family-section section-wrap" id="family">
        <div className="section-heading">
          <p className="section-kicker">{copy.familyKicker}</p>
          <h2>{copy.familyTitle}</h2>
        </div>
        <div className="family-lead-grid">
          <div className="family-panel family-panel--groom">
            <MandalaWatermark className="family-panel-mandala" />
            <span className="family-icon">
              <Flower2 aria-hidden="true" />
            </span>
            <p className="family-label">{copy.groomFamily}</p>
            <p>{weddingConfig.groom.father}</p>
            <p>{weddingConfig.groom.mother}</p>
          </div>
          <div className="family-panel family-panel--bride">
            <MandalaWatermark className="family-panel-mandala" />
            <span className="family-icon">
              <Flower2 aria-hidden="true" />
            </span>
            <p className="family-label">{copy.brideFamily}</p>
            <p>{weddingConfig.bride.father}</p>
            <p>{weddingConfig.bride.mother}</p>
          </div>
        </div>
        <div className="family-note-grid">
          <FamilyList title={copy.wellWishers} names={[...weddingConfig.family.wellWishers]} />
          <FamilyList
            title={copy.darshanabhilashi}
            names={[...weddingConfig.family.darshanabhilashi]}
          />
          <FamilyList
            title={copy.welcomeRepresentatives}
            names={[...weddingConfig.family.welcomeRepresentatives]}
          />
        </div>
      </section>

      <section className="events-section" id="events">
        <div className="section-wrap">
          <div className="section-heading section-heading--light">
            <p className="section-kicker">{copy.eventsKicker}</p>
            <h2>{copy.eventsTitle}</h2>
            <p>{copy.eventsDescription}</p>
          </div>
          <div className="event-timeline">
            {weddingConfig.events.map((eventData, index) => {
              const eventImage = weddingImages.events[eventData.key];
              const isShared = copiedNumber === `event-${eventData.key}`;
              return (
                <article className="event-row" key={eventData.key}>
                  <div className="event-marker">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="event-card">
                    <div className="event-visual">
                      <WeddingImage
                        src={eventImage.src}
                        alt={language === "hi" ? eventImage.altHi : eventImage.altEn}
                        fallbackGradient={eventImage.fallbackGradient}
                      />
                    </div>
                    <div className="event-copy">
                      <p className="event-date">
                        {language === "hi" ? eventData.dateHi : eventData.dateEn} <span>·</span>{" "}
                        {language === "hi" ? eventData.dayHi : eventData.dayEn}
                      </p>
                      <h3>{language === "hi" ? eventData.titleHi : eventData.titleEn}</h3>
                      <p className="event-subtitle-alt">
                        {language === "hi" ? eventData.titleEn : eventData.titleHi}
                      </p>
                      {"startTime" in eventData && eventData.startTime ? (
                        <p className="event-time">
                          {copy.eventTime}:{" "}
                          {language === "hi" ? eventData.startTimeHi : eventData.startTimeEn}
                          {"durationHours" in eventData && eventData.durationHours === 24
                            ? ` · ${copy.twentyFourHours}`
                            : ""}
                        </p>
                      ) : null}
                      <p className="event-description">
                        {language === "hi" ? eventData.descriptionHi : eventData.descriptionEn}
                      </p>
                      <div className="event-actions">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addToCalendar(eventData.key)}
                        >
                          <CalendarDays aria-hidden="true" />
                          {copy.addToCalendar}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => void shareEvent(eventData.key)}
                        >
                          <Share2 aria-hidden="true" />
                          {isShared ? copy.copied : copy.shareEvent}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="barat-section section-wrap">
        <div className="barat-visual">
          <div className="barat-photo-frame">
            <WeddingImage
              src={weddingImages.baratConvoy.src}
              alt={
                language === "hi"
                  ? weddingImages.baratConvoy.altHi
                  : weddingImages.baratConvoy.altEn
              }
              fallbackGradient={weddingImages.baratConvoy.fallbackGradient}
            />
          </div>
          <div className="travel-card">
            <MapPin className="travel-pin" aria-hidden="true" />
            <p className="travel-label">{copy.departurePoint}</p>
            <p className="travel-address">{weddingConfig.departure.addressHi}</p>
            <p className="travel-address-en">{weddingConfig.departure.addressEn}</p>
            <span className="travel-time">{copy.departureTime} · 03:00 PM</span>
          </div>
        </div>
        <div className="barat-copy">
          <p className="section-kicker">{copy.travelKicker}</p>
          <h2>{copy.baratTitle}</h2>
          <blockquote>{weddingConfig.departure.originalMessage}</blockquote>
          {language === "en" ? (
            <p className="barat-translation">{weddingConfig.departure.originalMessageEn}</p>
          ) : null}
          <p className="barat-method">{copy.baratMethod}</p>
          <FloralDivider />
        </div>
      </section>

      <section className="venue-section section-wrap" id="venue">
        <div className="venue-map-art">
          <WeddingImage
            src={weddingImages.venueBackdrop.src}
            alt={
              language === "hi"
                ? weddingImages.venueBackdrop.altHi
                : weddingImages.venueBackdrop.altEn
            }
            fallbackGradient={weddingImages.venueBackdrop.fallbackGradient}
          />
          <div className="venue-art-overlay" aria-hidden="true">
            <MapPin />
          </div>
        </div>
        <div className="venue-copy">
          <p className="section-kicker">{copy.venueKicker}</p>
          <h2>{copy.venueTitle}</h2>
          {weddingConfig.venue.name ? (
            <div className="venue-confirmed">
              <h3>{weddingConfig.venue.name}</h3>
              {weddingConfig.venue.address ? (
                <p className="venue-address">
                  <strong>{copy.venueAddressLabel}:</strong> {weddingConfig.venue.address}
                </p>
              ) : null}
              {weddingConfig.venue.mapUrl ? (
                <a
                  href={weddingConfig.venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="venue-map-link"
                >
                  <MapPin size={15} aria-hidden="true" />
                  {copy.venueOpenMaps}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : (
            <>
              <p>
                {language === "hi" ? weddingConfig.venue.messageHi : weddingConfig.venue.messageEn}
              </p>
              <span className="venue-status">
                <Sparkles size={14} aria-hidden="true" />
                {copy.venuePending}
              </span>
            </>
          )}
        </div>
      </section>

      <section className="gallery-section section-wrap" id="gallery">
        <div className="section-heading">
          <p className="section-kicker">{copy.galleryKicker}</p>
          <h2>{copy.galleryTitle}</h2>
          <p>{copy.galleryDescription}</p>
        </div>
        <div className="gallery-filters" role="group" aria-label={copy.galleryCategories}>
          {GALLERY_CATEGORIES.map((category) => (
            <Button
              type="button"
              variant={galleryCategory === category ? "default" : "outline"}
              size="sm"
              key={category}
              onClick={() => setGalleryCategory(category)}
              aria-pressed={galleryCategory === category}
            >
              {copy.galleryFilter[category]}
            </Button>
          ))}
        </div>
        <div className="gallery-grid">
          {filteredGallery.map((item) => {
            const index = weddingConfig.gallery.indexOf(item);
            return (
              <Button
                variant="ghost"
                className={`gallery-tile gallery-tile--${item.art}`}
                type="button"
                key={item.key}
                onClick={() => setActiveGallery(index)}
                aria-label={`${copy.openImage}: ${language === "hi" ? item.titleHi : item.titleEn}`}
              >
                <span className="gallery-art">
                  <MandalaWatermark className="gallery-mandala" />
                  <Flower2 aria-hidden="true" />
                  <span>{copy.photoPlaceholder}</span>
                </span>
                <span className="gallery-caption">
                  <span>{language === "hi" ? item.titleHi : item.titleEn}</span>
                  <span>{copy.photoPending}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-wrap contact-layout">
          <div className="contact-copy">
            <p className="section-kicker">{copy.contactKicker}</p>
            <h2>{copy.contactTitle}</h2>
            <p className="contact-person">{weddingConfig.groom.father}</p>
            <p className="contact-address">
              {language === "hi"
                ? weddingConfig.departure.addressHi
                : weddingConfig.departure.addressEn}
            </p>
          </div>
          <div className="contact-numbers">
            {weddingConfig.contactPhones.map((phone) => (
              <div className="contact-number" key={phone}>
                <a href={`tel:${phone}`}>
                  <Volume2 aria-hidden="true" />
                  {phone}
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => void copyPhone(phone)}
                  aria-label={`${copy.copyNumber} ${phone}`}
                  title={copy.copyNumber}
                >
                  {copiedNumber === phone ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </Button>
                <a
                  className="whatsapp-link"
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${copy.whatsapp} ${phone}`}
                  title={copy.whatsapp}
                >
                  <Share2 aria-hidden="true" />
                </a>
              </div>
            ))}
            {copiedNumber && !copiedNumber.startsWith("event-") ? (
              <p className="copy-confirmation" role="status">
                {copy.numberCopied}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="final-blessing-section" aria-label={copy.finalBlessing}>
        <div className="section-wrap final-blessing-inner">
          <MandalaWatermark className="final-mandala" />
          <p className="final-blessing-quote">“{copy.finalBlessing}”</p>
          <p className="final-with-love">{copy.withLove}</p>
          <p className="final-signature">
            ADITYA <Heart aria-hidden="true" /> ANJALI
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#home">
          Aditya <Heart aria-hidden="true" /> Anjali
        </a>
        <p>{copy.footerBlessing}</p>
        <span>
          {weddingConfig.wedding.year} ·{" "}
          {language === "hi" ? weddingConfig.locationShortHi : weddingConfig.locationShort}
        </span>
      </footer>

      <nav className="mobile-nav" aria-label={copy.primaryNavigation}>
        <a href="#home">
          <Flower2 aria-hidden="true" />
          <span>{copy.navHome}</span>
        </a>
        <a href="#events">
          <CalendarDays aria-hidden="true" />
          <span>{copy.navEvents}</span>
        </a>
        <a href="#gallery">
          <Sparkles aria-hidden="true" />
          <span>{copy.navGallery}</span>
        </a>
      </nav>

      {introVisible ? (
        <div
          className={`wedding-intro${introOpening ? " is-opening" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={copy.openingInvitation}
        >
          <span className="temple-cap temple-cap--top" aria-hidden="true" />

          <div className="temple-middle-row">
            <span className="temple-wing temple-wing--left" aria-hidden="true" />

            <div className="temple-stage">
              <div className="temple-doorway">
                <span className="intro-threshold-light" aria-hidden="true" />
                <div
                  className="intro-door intro-door--left"
                  onClick={openInvitation}
                  aria-hidden="true"
                >
                  <img
                    src={weddingImages.templeDoorLeft.src}
                    alt=""
                    loading="eager"
                    decoding="sync"
                    className="intro-door-img"
                  />
                  <span className="door-thickness" />
                </div>
                <div
                  className="intro-door intro-door--right"
                  onClick={openInvitation}
                  aria-hidden="true"
                >
                  <img
                    src={weddingImages.templeDoorRight.src}
                    alt=""
                    loading="eager"
                    decoding="sync"
                    className="intro-door-img"
                  />
                  <span className="door-thickness" />
                </div>
                <span className="intro-seam-shadow" aria-hidden="true" />
              </div>

              <img
                src={weddingImages.templeFrame.src}
                alt={language === "hi" ? weddingImages.templeFrame.altHi : weddingImages.templeFrame.altEn}
                loading="eager"
                decoding="sync"
                className="temple-frame-img"
              />

              <span className="intro-flame-glow intro-flame-glow--hang-left" aria-hidden="true" />
              <span className="intro-flame-glow intro-flame-glow--hang-right" aria-hidden="true" />
              <span className="intro-flame-glow intro-flame-glow--stand-left" aria-hidden="true" />
              <span className="intro-flame-glow intro-flame-glow--stand-right" aria-hidden="true" />
              <span className="intro-flame-glow intro-flame-glow--center-diya" aria-hidden="true" />

              <div className="intro-lintel-wrap" aria-hidden="true">
                <span className="intro-lintel-mantra">॥ श्री गणेशाय नमः ॥</span>
              </div>
            </div>

            <span className="temple-wing temple-wing--right" aria-hidden="true" />
          </div>

          <span className="temple-cap temple-cap--bottom" aria-hidden="true" />
        </div>
      ) : null}

      {activeImage ? (
        <div
          className="gallery-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={copy.galleryTitle}
          onClick={() => setActiveGallery(null)}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX;
            if (start === null || end === undefined || Math.abs(start - end) < 45) return;
            setActiveGallery((current) =>
              current === null
                ? null
                : (current + (end < start ? 1 : -1) + weddingConfig.gallery.length) %
                  weddingConfig.gallery.length,
            );
            touchStartX.current = null;
          }}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="viewer-close"
            onClick={() => setActiveGallery(null)}
            aria-label={copy.close}
          >
            <X aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="viewer-prev"
            onClick={(event) => {
              event.stopPropagation();
              setActiveGallery(
                (activeGallery ?? 0) === 0
                  ? weddingConfig.gallery.length - 1
                  : (activeGallery ?? 1) - 1,
              );
            }}
            aria-label={copy.previousImage}
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <div
            className={`viewer-art viewer-art--${activeImage.art}`}
            onClick={(event) => event.stopPropagation()}
          >
            <MandalaWatermark className="viewer-mandala" />
            <Flower2 aria-hidden="true" />
            <span>{copy.photoPlaceholder}</span>
          </div>
          <div className="viewer-caption" onClick={(event) => event.stopPropagation()}>
            <strong>{language === "hi" ? activeImage.titleHi : activeImage.titleEn}</strong>
            <span>{copy.photoPending}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="viewer-next"
            onClick={(event) => {
              event.stopPropagation();
              setActiveGallery(((activeGallery ?? 0) + 1) % weddingConfig.gallery.length);
            }}
            aria-label={copy.nextImage}
          >
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </main>
  );
}

function ProfileCard({ language, kind }: { language: Language; kind: "groom" | "bride" }) {
  const copy = weddingCopy[language];
  const person = weddingConfig[kind];
  const photoUrl = weddingConfig.photographs[kind];

  return (
    <article className={`profile-card profile-card--${kind}`}>
      <div className={`profile-portrait profile-portrait--${kind}`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={language === "hi" ? person.nameHi : person.nameEn}
            loading="lazy"
            className="profile-portrait-photo"
          />
        ) : (
          <>
            <MandalaWatermark className="portrait-mandala" />
            <div className="portrait-ornament" aria-hidden="true">
              <Flower2 />
              <span>{kind === "groom" ? "आ" : "अं"}</span>
            </div>
            <span className="portrait-status">{copy.photoPending}</span>
          </>
        )}
      </div>
      <div className="profile-details">
        <p className="profile-role">{kind === "groom" ? copy.groomRole : copy.brideRole}</p>
        <h3>{person.nameHi}</h3>
        <p className="profile-name-en">{person.nameEn}</p>
        <p className="profile-note">
          {kind === "groom" ? copy.groomProfession : copy.brideEducation}
        </p>
        <div className="profile-family">
          <span>{copy.fatherLabel}</span>
          <strong>{person.father}</strong>
          <span>{copy.motherLabel}</span>
          <strong>{person.mother}</strong>
        </div>
      </div>
    </article>
  );
}

function FamilyList({ title, names }: { title: string; names: string[] }) {
  return (
    <article className="family-list">
      <h3>{title}</h3>
      <p>{names.join(" · ")}</p>
    </article>
  );
}
