import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
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
import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { weddingConfig, weddingCopy, type EventKey, type Language } from "@/data/weddingConfig";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aditya & Anjali | Wedding Invitation" },
      {
        name: "description",
        content: "A heartfelt invitation to celebrate the wedding of Aditya Kumar Singh and Anjali in Saran, Bihar.",
      },
      { property: "og:title", content: "Aditya & Anjali | Wedding Invitation" },
      {
        property: "og:description",
        content: "Join Aditya and Anjali's family for their wedding celebrations, 28 November–03 December 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingInvitation,
});

type Attendance = "accepts" | "declines" | "unsure";

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

function WeddingInvitation() {
  const [language, setLanguage] = useState<Language>("hi");
  const [introVisible, setIntroVisible] = useState(true);
  const [introOpening, setIntroOpening] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [playing, setPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<EventKey[]>([]);
  const [attendance, setAttendance] = useState<Attendance>("accepts");
  const [attendees, setAttendees] = useState("2");
  const [submitting, setSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [thankYouName, setThankYouName] = useState("");
  const [copiedNumber, setCopiedNumber] = useState("");
  const [activeGallery, setActiveGallery] = useState<number | null>(null);
  const [galleryCategory, setGalleryCategory] = useState("all");
  const [honeypot, setHoneypot] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStartX = useRef<number | null>(null);
  const copy = weddingCopy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("aditya-anjali-language");
    if (saved === "hi" || saved === "en") setLanguage(saved);
    const tick = () => setCountdown(getCountdown());
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("aditya-anjali-language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (activeGallery === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGallery(null);
      if (event.key === "ArrowRight") setActiveGallery((current) => current === null ? null : (current + 1) % weddingConfig.gallery.length);
      if (event.key === "ArrowLeft") setActiveGallery((current) => current === null ? null : (current - 1 + weddingConfig.gallery.length) % weddingConfig.gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeGallery]);

  const openInvitation = () => {
    setIntroOpening(true);
    window.setTimeout(() => setIntroVisible(false), 1_350);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !weddingConfig.audioUrl) {
      setMusicError(true);
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setMusicError(false);
      setPlaying(true);
    } catch {
      setPlaying(false);
      setMusicError(true);
    }
  };

  const handleRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpError("");
    if (honeypot) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const guestName = String(form.get("guestName") ?? "").trim();
    const rawPhone = String(form.get("mobile") ?? "").trim().replace(/[\s()-]/g, "");
    const mobileNumber = rawPhone.replace(/(?!^\+)\D/g, "");
    const numericAttendees = Number(attendees);
    if (guestName.length < 2 || guestName.length > 120 || !/^\+?[0-9]{10,15}$/.test(mobileNumber) || numericAttendees < 1 || numericAttendees > 12) {
      setRsvpError(copy.rsvpValidation);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("wedding_guest_rsvps").insert({
      guest_name: guestName,
      mobile_number: mobileNumber,
      attendees: numericAttendees,
      attendance_status: attendance,
      selected_events: selectedEvents,
      blessing_message: String(form.get("blessing") ?? "").trim(),
    });
    setSubmitting(false);

    if (error) {
      setRsvpError(error.code === "23505" ? copy.duplicateRsvp : copy.rsvpError);
      return;
    }
    setThankYouName(guestName);
    formElement.reset();
    setSelectedEvents([]);
    setAttendance("accepts");
    setAttendees("2");
  };

  const toggleEvent = (key: EventKey) => {
    setSelectedEvents((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };

  const addToCalendar = (key: EventKey) => {
    const eventData = weddingConfig.events.find((item) => item.key === key);
    if (!eventData) return;
    const dateCompact = eventData.date.replaceAll("-", "");
    const startsAt = eventData.startTime
      ? `DTSTART;TZID=${weddingConfig.timezone}:${dateCompact}T${eventData.startTime.replace(":", "")}00`
      : `DTSTART;VALUE=DATE:${dateCompact}`;
    const endDate = eventData.durationHours === 24
      ? new Date(new Date(`${eventData.date}T00:00:00Z`).getTime() + 86_400_000).toISOString().slice(0, 10).replaceAll("-", "")
      : null;
    const endsAt = eventData.durationHours === 24 && endDate
      ? `DTEND;TZID=${weddingConfig.timezone}:${endDate}T${eventData.startTime?.replace(":", "") ?? "0700"}00`
      : eventData.startTime
        ? `DTEND;TZID=${weddingConfig.timezone}:${dateCompact}T${String(Number(eventData.startTime.slice(0, 2)) + 1).padStart(2, "0")}${eventData.startTime.slice(3)}00`
        : `DTEND;VALUE=DATE:${new Date(new Date(`${eventData.date}T00:00:00Z`).getTime() + 86_400_000).toISOString().slice(0, 10).replaceAll("-", "")}`;
    const summary = language === "hi" ? eventData.titleHi : eventData.titleEn;
    const description = language === "hi" ? eventData.descriptionHi : eventData.descriptionEn;
    const calendar = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aditya and Anjali//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:${eventData.key}@aditya-anjali-wedding`, `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      startsAt, endsAt, `SUMMARY:${summary}`, `DESCRIPTION:${description}`, "END:VEVENT", "END:VCALENDAR",
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
      try { await navigator.share({ title, text, url: window.location.href }); } catch { /* dismissed by visitor */ }
      return;
    }
    await navigator.clipboard.writeText(`${text} · ${window.location.href}`);
    setCopiedNumber("event");
    window.setTimeout(() => setCopiedNumber(""), 1_800);
  };

  const copyPhone = async (phone: string) => {
    await navigator.clipboard.writeText(phone);
    setCopiedNumber(phone);
    window.setTimeout(() => setCopiedNumber(""), 1_800);
  };

  const filteredGallery = weddingConfig.gallery.filter((item) => galleryCategory === "all" || item.category === galleryCategory);
  const activeImage = activeGallery === null ? null : weddingConfig.gallery[activeGallery];

  return (
    <main className="wedding-page">
      {weddingConfig.audioUrl ? <audio ref={audioRef} src={weddingConfig.audioUrl} loop onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setMusicError(true); }} /> : null}

      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Aditya and Anjali home">
          <span className="wordmark-mark"><Flower2 aria-hidden="true" /></span>
          <span>Aditya <i>&</i> Anjali</span>
        </a>
        <nav className="desktop-nav" aria-label={copy.primaryNavigation}>
          <a href="#home">{copy.navHome}</a>
          <a href="#events">{copy.navEvents}</a>
          <a href="#rsvp">{copy.navRsvp}</a>
          <a href="#gallery">{copy.navGallery}</a>
        </nav>
        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={copy.language}>
            <Button type="button" variant="ghost" size="sm" aria-pressed={language === "hi"} onClick={() => setLanguage("hi")}>हिंदी</Button>
            <span aria-hidden="true">/</span>
            <Button type="button" variant="ghost" size="sm" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</Button>
          </div>
          <Button type="button" variant="outline" size="icon" className="music-button" onClick={toggleMusic} aria-label={playing ? copy.pauseMusic : copy.playMusic} title={playing ? copy.pauseMusic : copy.playMusic}>
            {playing ? <Pause aria-hidden="true" /> : musicError ? <Music2 aria-hidden="true" /> : <Play aria-hidden="true" />}
          </Button>
        </div>
      </header>

      {musicError ? <p className="music-notice" role="status">{copy.musicUnavailable}</p> : null}

      <section className="hero" id="home" aria-labelledby="couple-title">
        <div className="hero-ornament hero-ornament-left" aria-hidden="true"><Flower2 /></div>
        <div className="hero-ornament hero-ornament-right" aria-hidden="true"><Flower2 /></div>
        <div className="hero-inner">
          <p className="eyebrow hero-eyebrow">{copy.heroOverline}</p>
          <span className="hero-rule" aria-hidden="true"><span /></span>
          <h1 id="couple-title"><span>{weddingConfig.groom.nameEn}</span><Heart className="hero-heart" aria-label="and" /><span>{weddingConfig.bride.nameEn}</span></h1>
          <p className="hero-deck">{copy.heroQuote}</p>
          <p className="hero-date">{language === "hi" ? weddingConfig.wedding.dateHi : weddingConfig.wedding.dateEn}</p>
          <p className="hero-location"><MapPin size={15} aria-hidden="true" />{weddingConfig.locationShort}</p>
          <div className="countdown" aria-label={copy.countdownLabel}>
            {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
              <div className="countdown-unit" key={unit}>
                <span className="countdown-number">{String(countdown[unit]).padStart(2, "0")}</span>
                <span className="countdown-label">{copy.countdown[unit]}</span>
              </div>
            ))}
          </div>
          <a className="scroll-cue" href="#invitation"><span>{copy.scroll}</span><ArrowDown size={15} aria-hidden="true" /></a>
        </div>
        <p className="hero-side-note" aria-hidden="true">{weddingConfig.wedding.year}</p>
      </section>

      <section className="invitation section-wrap" id="invitation">
        <div className="invitation-mark" aria-hidden="true"><span>श्री</span></div>
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
        <p className="welcome-copy">{copy.welcomeOne}<br />{copy.welcomeTwo}<br />{copy.welcomeThree}</p>
        <span className="section-flourish" aria-hidden="true"><span /><Flower2 /><span /></span>
      </section>

      <section className="couple-section section-wrap" id="couple">
        <div className="section-heading">
          <p className="section-kicker">{copy.coupleKicker}</p>
          <h2>{copy.coupleTitle}</h2>
          <p>{copy.coupleDescription}</p>
        </div>
        <div className="couple-grid">
          <ProfileCard language={language} kind="groom" />
          <div className="couple-join-mark" aria-hidden="true"><Heart /><span>03 · XII · 26</span></div>
          <ProfileCard language={language} kind="bride" />
        </div>
      </section>

      <section className="family-section section-wrap" id="family">
        <div className="section-heading">
          <p className="section-kicker">{copy.familyKicker}</p>
          <h2>{copy.familyTitle}</h2>
        </div>
        <div className="family-lead-grid">
          <div className="family-panel family-panel--groom">
            <span className="family-icon"><Flower2 aria-hidden="true" /></span>
            <p className="family-label">{copy.groomFamily}</p>
            <p>{weddingConfig.groom.father}</p>
            <p>{weddingConfig.groom.mother}</p>
          </div>
          <div className="family-panel family-panel--bride">
            <span className="family-icon"><Flower2 aria-hidden="true" /></span>
            <p className="family-label">{copy.brideFamily}</p>
            <p>{weddingConfig.bride.father}</p>
            <p>{weddingConfig.bride.mother}</p>
          </div>
        </div>
        <div className="family-note-grid">
          <FamilyList title={copy.wellWishers} names={weddingConfig.family.wellWishers} />
          <FamilyList title={copy.darshanabhilashi} names={weddingConfig.family.darshanabhilashi} />
          <FamilyList title={copy.welcomeRepresentatives} names={weddingConfig.family.welcomeRepresentatives} />
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
            {weddingConfig.events.map((eventData, index) => (
              <article className="event-row" key={eventData.key}>
                <div className="event-marker"><span>{String(index + 1).padStart(2, "0")}</span></div>
                <div className="event-card">
                  <div className={`event-art event-art--${index + 1}`} aria-hidden="true"><Flower2 /></div>
                  <div className="event-copy">
                    <p className="event-date">{language === "hi" ? eventData.dateHi : eventData.dateEn} <span>·</span> {language === "hi" ? eventData.dayHi : eventData.dayEn}</p>
                    <h3>{language === "hi" ? eventData.titleHi : eventData.titleEn}</h3>
                    {eventData.startTime ? <p className="event-time">{copy.eventTime} {language === "hi" ? eventData.startTimeHi : eventData.startTimeEn}{eventData.durationHours === 24 ? ` · ${copy.twentyFourHours}` : ""}</p> : null}
                    <p className="event-description">{language === "hi" ? eventData.descriptionHi : eventData.descriptionEn}</p>
                    <div className="event-actions">
                      <Button type="button" variant="outline" size="sm" onClick={() => addToCalendar(eventData.key)}><CalendarDays aria-hidden="true" />{copy.addToCalendar}</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => void shareEvent(eventData.key)}><Share2 aria-hidden="true" />{copiedNumber === "event" ? copy.copied : copy.shareEvent}</Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="barat-section section-wrap">
        <div className="barat-copy">
          <p className="section-kicker">{copy.travelKicker}</p>
          <h2>{copy.baratTitle}</h2>
          <blockquote>{weddingConfig.departure.originalMessage}</blockquote>
          <p>{copy.baratMethod}</p>
        </div>
        <div className="travel-card">
          <MapPin className="travel-pin" aria-hidden="true" />
          <p className="travel-label">{copy.departurePoint}</p>
          <p className="travel-address">{weddingConfig.departure.addressHi}</p>
          <p className="travel-address-en">{weddingConfig.departure.addressEn}</p>
          <span className="travel-time">{copy.departureTime} · 03:00 PM</span>
        </div>
      </section>

      <section className="venue-section section-wrap" id="venue">
        <div className="venue-map-art" aria-hidden="true"><MapPin /><span /><span /><span /></div>
        <div className="venue-copy">
          <p className="section-kicker">{copy.venueKicker}</p>
          <h2>{copy.venueTitle}</h2>
          <p>{language === "hi" ? weddingConfig.venue.messageHi : weddingConfig.venue.messageEn}</p>
          <span className="venue-status"><Sparkles size={14} aria-hidden="true" />{copy.venuePending}</span>
        </div>
      </section>

      <section className="rsvp-section" id="rsvp">
        <div className="section-wrap rsvp-layout">
          <div className="rsvp-intro">
            <p className="section-kicker">{copy.rsvpKicker}</p>
            <h2>{copy.rsvpTitle}</h2>
            <p>{copy.rsvpDescription}</p>
            <span className="rsvp-flourish" aria-hidden="true"><Heart /><span /></span>
          </div>
          {thankYouName ? (
            <div className="rsvp-success" role="status">
              <span className="success-seal"><Check aria-hidden="true" /></span>
              <p className="section-kicker">{copy.rsvpReceived}</p>
              <h3>{copy.thankYou}, {thankYouName}</h3>
              <p>{copy.thankYouMessage}</p>
              <Button type="button" variant="outline" onClick={() => setThankYouName("")}>{copy.sendAnother}</Button>
            </div>
          ) : (
            <form className="rsvp-form" onSubmit={handleRsvp}>
              <label className="rsvp-field"><span>{copy.guestName}</span><input name="guestName" autoComplete="name" required minLength={2} maxLength={120} placeholder={copy.namePlaceholder} /></label>
              <label className="rsvp-field"><span>{copy.mobileNumber}</span><input name="mobile" type="tel" autoComplete="tel" inputMode="tel" required placeholder={copy.mobilePlaceholder} /></label>
              <label className="rsvp-field"><span>{copy.attendees}</span><span className="select-wrap"><select value={attendees} onChange={(event) => setAttendees(event.target.value)} aria-label={copy.attendees}>{Array.from({ length: 12 }, (_, index) => index + 1).map((count) => <option key={count} value={String(count)}>{count}</option>)}</select><ChevronDown aria-hidden="true" /></span></label>
              <fieldset className="attendance-fieldset">
                <legend>{copy.attendance}</legend>
                {(["accepts", "declines", "unsure"] as Attendance[]).map((value) => (
                  <label className={`attendance-option${attendance === value ? " is-selected" : ""}`} key={value}>
                    <input type="radio" name="attendance" value={value} checked={attendance === value} onChange={() => setAttendance(value)} />
                    <span className="radio-mark" aria-hidden="true" />
                    <span>{copy.attendanceOptions[value]}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset className="event-select-fieldset">
                <legend>{copy.eventsAttending}</legend>
                <div className="event-checkbox-grid">
                  {weddingConfig.events.map((item) => (
                    <label className="event-checkbox" key={item.key}>
                      <input type="checkbox" checked={selectedEvents.includes(item.key)} onChange={() => toggleEvent(item.key)} />
                      <span className="checkbox-mark"><Check aria-hidden="true" /></span>
                      <span>{language === "hi" ? item.titleHi : item.titleEn}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="rsvp-field"><span>{copy.blessingOptional}</span><textarea name="blessing" rows={3} maxLength={500} placeholder={copy.blessingPlaceholder} /></label>
              <label className="honeypot" aria-hidden="true">Company<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} /></label>
              {rsvpError ? <p className="rsvp-error" role="alert">{rsvpError}</p> : null}
              <Button type="submit" size="lg" className="rsvp-submit" disabled={submitting}>{submitting ? copy.submitting : copy.submitRsvp}<ArrowRight aria-hidden="true" /></Button>
              <p className="privacy-note">{copy.privacyNote}</p>
            </form>
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
          {["all", "couple", "groom", "bride", "moments"].map((category) => (
            <Button type="button" variant={galleryCategory === category ? "default" : "outline"} size="sm" key={category} onClick={() => setGalleryCategory(category)} aria-pressed={galleryCategory === category}>{copy.galleryFilter[category as keyof typeof copy.galleryFilter]}</Button>
          ))}
        </div>
        <div className="gallery-grid">
          {filteredGallery.map((item) => {
            const index = weddingConfig.gallery.indexOf(item);
            return (
              <Button variant="ghost" className={`gallery-tile gallery-tile--${item.art}`} type="button" key={item.key} onClick={() => setActiveGallery(index)} aria-label={`${copy.openImage}: ${language === "hi" ? item.titleHi : item.titleEn}`}>
                <span className="gallery-art"><Flower2 aria-hidden="true" /><span>{copy.photoPlaceholder}</span></span>
                <span className="gallery-caption"><span>{language === "hi" ? item.titleHi : item.titleEn}</span><span>{copy.photoPending}</span></span>
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
            <p className="contact-address">{weddingConfig.departure.addressHi}</p>
          </div>
          <div className="contact-numbers">
            {weddingConfig.contactPhones.map((phone) => (
              <div className="contact-number" key={phone}>
                <a href={`tel:${phone}`}><Volume2 aria-hidden="true" />{phone}</a>
                <Button type="button" variant="ghost" size="icon" onClick={() => void copyPhone(phone)} aria-label={`${copy.copyNumber} ${phone}`} title={copy.copyNumber}>{copiedNumber === phone ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
                <a className="whatsapp-link" href={`https://wa.me/91${phone}`} target="_blank" rel="noreferrer" aria-label={`${copy.whatsapp} ${phone}`} title={copy.whatsapp}><Share2 aria-hidden="true" /></a>
              </div>
            ))}
            {copiedNumber && copiedNumber !== "event" ? <p className="copy-confirmation" role="status">{copy.numberCopied}</p> : null}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#home">Aditya <Heart aria-hidden="true" /> Anjali</a>
        <p>{copy.footerBlessing}</p>
        <span>{weddingConfig.wedding.year} · {weddingConfig.locationShort}</span>
      </footer>

      <nav className="mobile-nav" aria-label={copy.primaryNavigation}>
        <a href="#home"><Flower2 aria-hidden="true" /><span>{copy.navHome}</span></a>
        <a href="#events"><CalendarDays aria-hidden="true" /><span>{copy.navEvents}</span></a>
        <a href="#rsvp"><Heart aria-hidden="true" /><span>{copy.navRsvp}</span></a>
        <a href="#gallery"><Sparkles aria-hidden="true" /><span>{copy.navGallery}</span></a>
      </nav>

      {introVisible ? (
        <div className={`wedding-intro${introOpening ? " is-opening" : ""}`} role="dialog" aria-modal="true" aria-label={copy.openingInvitation}>
          <div className="intro-door intro-door--left" aria-hidden="true" />
          <div className="intro-door intro-door--right" aria-hidden="true" />
          <div className="intro-pattern" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="intro-center">
            <span className="intro-blessing">॥ श्री गणेशाय नमः ॥</span>
            <span className="intro-symbol" aria-hidden="true"><Flower2 /><b>श्री</b></span>
            <p>{copy.blessingOfAlmighty}</p>
            <h2>ADITYA <Heart aria-hidden="true" /> ANJALI</h2>
            <span className="intro-date">03 · 12 · 2026</span>
            <Button type="button" className="intro-open-button" onClick={openInvitation}>{copy.openInvitation}<ArrowRight aria-hidden="true" /></Button>
          </div>
          <Button type="button" variant="ghost" className="intro-skip" onClick={() => setIntroVisible(false)}>{copy.skipIntro}<ArrowRight aria-hidden="true" /></Button>
        </div>
      ) : null}

      {activeImage ? (
        <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={copy.galleryTitle} onClick={() => setActiveGallery(null)} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          if (start === null || end === undefined || Math.abs(start - end) < 45) return;
          setActiveGallery((current) => current === null ? null : (current + (end < start ? 1 : -1) + weddingConfig.gallery.length) % weddingConfig.gallery.length);
          touchStartX.current = null;
        }}>
          <Button type="button" variant="ghost" size="icon" className="viewer-close" onClick={() => setActiveGallery(null)} aria-label={copy.close}><X aria-hidden="true" /></Button>
          <Button type="button" variant="ghost" size="icon" className="viewer-prev" onClick={(event) => { event.stopPropagation(); setActiveGallery((activeGallery ?? 0) === 0 ? weddingConfig.gallery.length - 1 : (activeGallery ?? 1) - 1); }} aria-label={copy.previousImage}><ArrowLeft aria-hidden="true" /></Button>
          <div className={`viewer-art viewer-art--${activeImage.art}`} onClick={(event) => event.stopPropagation()}><Flower2 aria-hidden="true" /><span>{copy.photoPlaceholder}</span></div>
          <div className="viewer-caption" onClick={(event) => event.stopPropagation()}><strong>{language === "hi" ? activeImage.titleHi : activeImage.titleEn}</strong><span>{copy.photoPending}</span></div>
          <Button type="button" variant="ghost" size="icon" className="viewer-next" onClick={(event) => { event.stopPropagation(); setActiveGallery(((activeGallery ?? 0) + 1) % weddingConfig.gallery.length); }} aria-label={copy.nextImage}><ArrowRight aria-hidden="true" /></Button>
        </div>
      ) : null}
    </main>
  );
}

function ProfileCard({ language, kind }: { language: Language; kind: "groom" | "bride" }) {
  const copy = weddingCopy[language];
  const person = weddingConfig[kind];
  return (
    <article className={`profile-card profile-card--${kind}`}>
      <div className={`profile-portrait profile-portrait--${kind}`}>
        <div className="portrait-ornament" aria-hidden="true"><Flower2 /><span>{kind === "groom" ? "अ" : "अं"}</span></div>
        <span className="portrait-status">{copy.photoPending}</span>
      </div>
      <div className="profile-details">
        <p className="profile-role">{kind === "groom" ? copy.groomRole : copy.brideRole}</p>
        <h3>{person.nameHi}</h3>
        <p className="profile-name-en">{person.nameEn}</p>
        <p className="profile-note">{kind === "groom" ? copy.groomProfession : copy.brideEducation}</p>
        <div className="profile-family"><span>{copy.fatherLabel}</span><strong>{person.father}</strong><span>{copy.motherLabel}</span><strong>{person.mother}</strong></div>
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