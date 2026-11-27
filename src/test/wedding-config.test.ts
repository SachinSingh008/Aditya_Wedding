import { describe, expect, it } from "vitest";

import { weddingConfig } from "@/data/weddingConfig";

describe("wedding invitation details", () => {
  it("uses the confirmed wedding date and India-time countdown target", () => {
    expect(weddingConfig.wedding.date).toBe("2026-12-03");
    expect(weddingConfig.wedding.targetUtc).toBe("2026-12-02T18:30:00.000Z");
    expect(weddingConfig.timezone).toBe("Asia/Kolkata");
  });

  it("keeps all four confirmed celebration dates and days", () => {
    expect(weddingConfig.events.map(({ key, date, dayEn }) => [key, date, dayEn])).toEqual([
      ["akhand-ashtayam", "2026-11-28", "SATURDAY"],
      ["tilak", "2026-11-29", "SUNDAY"],
      ["matkor", "2026-12-02", "WEDNESDAY"],
      ["wedding", "2026-12-03", "THURSDAY"],
    ]);
  });

  it("only assigns the specified start time and duration to the Akhand Ashtayam", () => {
    expect(weddingConfig.events.map(({ key, startTime, durationHours }) => [key, startTime ?? null, durationHours ?? null])).toEqual([
      ["akhand-ashtayam", "07:00", 24],
      ["tilak", null, null],
      ["matkor", null, null],
      ["wedding", null, null],
    ]);
  });

  it("uses the confirmed Kushwaha Niwash venue and couple photograph", () => {
    expect(weddingConfig.venue.name).toBe("Kushwaha Niwash");
    expect(weddingConfig.venue.nameHi).toBe("कुशवाहा निवास");
    expect(weddingConfig.venue.mapUrl).toBe("https://maps.app.goo.gl/V7PoRT2YkHU2TPG67");
    expect(weddingConfig.departure.mapUrl).toBe("https://maps.app.goo.gl/V7PoRT2YkHU2TPG67");
    expect(weddingConfig.photographs).toEqual({
      groom: "/images/groom.jpg",
      bride: "/images/bride.jpg",
    });
  });

  it("keeps the confirmed baraat departure details", () => {
    expect(weddingConfig.departure.time).toBe("15:00");
    expect(weddingConfig.departure.method).toBe("private vehicles");
    expect(weddingConfig.departure.originalMessage).toBe("बारात मेरे निवास स्थान से निजी वाहन द्वारा दिन में 03 बजे से प्रस्थान करेगी।");
  });

  it("uses the two supplied family contact numbers", () => {
    expect(weddingConfig.contactPhones).toEqual(["9934982070", "8969305761"]);
  });
});