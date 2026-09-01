// ─────────────────────────────────────────────
//  BandStack · Seed Data
//  The Milo Vega Quartet — second artist build
//  Purpose: stress-test the template against a
//  genre/aesthetic completely unlike outlaw country
// ─────────────────────────────────────────────

import { Artist, Release, Show } from "@/lib/data";

export const artist: Artist = {
  name: "The Milo Vega Quartet",
  slug: "milo-vega-quartet",
  homeRoute: "/jazz",
  tagline: "Post-bop jazz from the south side of Chicago. Unresolved and unapologetic.",
  bio: [
    "The Milo Vega Quartet has spent fifteen years building a reputation as one of Chicago's most adventurous working bands — a group that holds deep reverence for the hard bop tradition while refusing to be contained by it. Pianist and bandleader Milo Vega leads a working ensemble that has logged more nights at the Green Mill and Andy's Jazz Club than most bands log in a lifetime.",
    "Their sound sits at the intersection of McCoy Tyner's harmonic density and Wayne Shorter's sense of compositional space — dense, searching, and at times brutally quiet. The quartet's 2022 record 'Unresolved' earned a placement on the DownBeat Critics Poll and cemented their national profile, leading to appearances at the Chicago Jazz Festival, Detroit Jazz Festival, and the Village Vanguard.",
    "Vega composes all original material, favoring minor tonalities, odd time signatures, and arrangements that leave deliberate space for collective improvisation. The quartet is known for long-form live sets that rarely match the studio versions — every performance is a conversation, not a recital.",
  ],
  origin: "Chicago, Illinois",
  genre: ["jazz", "post-bop", "contemporary jazz"],
  founded: 2009,
  members: [
    { name: "Milo Vega",       role: "Piano, Composition" },
    { name: "Dara Osei",       role: "Tenor Saxophone" },
    { name: "Tomás Arrieta",   role: "Double Bass" },
    { name: "Kenji Watanabe",  role: "Drums" },
  ],
  pressQuotes: [
    {
      quote: "Vega writes music that demands your full attention and rewards every second of it.",
      source: "DownBeat Magazine",
      url: "https://downbeat.com",
      year: 2023,
    },
    {
      quote: "One of the most cohesive working quartets in jazz today. The interplay is something rare.",
      source: "Chicago Tribune",
      year: 2022,
    },
    {
      quote: "Post-bop with a modern sensibility and zero nostalgia. Exactly what the music needs.",
      source: "JazzTimes",
      year: 2022,
    },
  ],
  awards: [
    "DownBeat Critics Poll — Rising Star Pianist, 2023",
    "Chicago Music Award — Best Jazz Act, 2022",
    "Illinois Arts Council Fellowship, 2021",
    "WBEZ Chicago — Best Local Jazz Album, 2022",
  ],
  socialLinks: {
    instagram: "https://instagram.com/milovegaquartet",
    facebook:  "https://facebook.com/milovegaquartet",
    twitter:   "https://twitter.com/milovegajazz",
    youtube:   "https://youtube.com/@MiloVegaQuartet",
  },
  streamingLinks: {
    spotify:    "https://open.spotify.com/artist/milovega",
    appleMusic: "https://music.apple.com/artist/milovega",
    youtube:    "https://youtube.com/@MiloVegaQuartet",
  },
  bookingEmail:  "booking@milovegaquartet.com",
  newsletterUrl: "https://milovegaquartet.com/subscribe",
};

export const releases: Release[] = [
  {
    slug: "unresolved",
    title: "Unresolved",
    type: "album",
    releaseDate: "2022-09-16",
    isFeatured: true,
    description: "DownBeat Critics Poll 2022. Eight original compositions exploring unresolved harmonic tension and the space between intention and accident.",
    streamingLinks: {
      spotify:    "https://open.spotify.com/album/unresolved",
      appleMusic: "https://music.apple.com/album/unresolved",
    },
    tracks: [
      { number: 1, title: "Minor Consent",          duration: "7:14" },
      { number: 2, title: "South Side Elegy",        duration: "9:02" },
      { number: 3, title: "Arrieta's Walk",           duration: "5:48" },
      { number: 4, title: "The Weight of Being",      duration: "11:33" },
      { number: 5, title: "Unresolved",               duration: "8:21" },
      { number: 6, title: "Watanabe Keeps the Time",  duration: "6:55" },
      { number: 7, title: "Osei's Answer",            duration: "7:40" },
      { number: 8, title: "Leaving the Green Mill",   duration: "4:12" },
    ],
  },
  {
    slug: "open-changes",
    title: "Open Changes",
    type: "album",
    releaseDate: "2020-03-06",
    streamingLinks: {
      spotify: "https://open.spotify.com/album/openchanges",
    },
    tracks: [
      { number: 1, title: "Chromatic Prayer",  duration: "6:30" },
      { number: 2, title: "Open Changes",      duration: "8:44" },
      { number: 3, title: "Lake Shore Drive",  duration: "5:19" },
    ],
  },
  {
    slug: "live-at-the-green-mill",
    title: "Live at the Green Mill",
    type: "live",
    releaseDate: "2019-11-15",
    description: "Recorded live at Chicago's Green Mill Cocktail Lounge. One set, no edits.",
    streamingLinks: {
      spotify: "https://open.spotify.com/album/greenmill",
    },
    tracks: [
      { number: 1, title: "Minor Consent (Live)",    duration: "12:08" },
      { number: 2, title: "South Side Elegy (Live)", duration: "14:22" },
      { number: 3, title: "Free Section",            duration: "18:41" },
    ],
  },
];

export const shows: Show[] = [
  {
    date: "2026-09-12",
    venue: "Andy's Jazz Club",
    city: "Chicago",
    state: "IL",
    country: "US",
    status: "upcoming",
    ticketUrl: "https://andysjazzclub.com/tickets",
  },
  {
    date: "2026-09-27",
    venue: "Detroit Jazz Festival",
    city: "Detroit",
    state: "MI",
    country: "US",
    status: "upcoming",
    ticketUrl: "https://detroitjazzfest.org",
  },
  {
    date: "2026-10-18",
    venue: "Village Vanguard",
    city: "New York",
    state: "NY",
    country: "US",
    status: "upcoming",
    ticketUrl: "https://villagevanguard.com",
    notes: "Two sets: 8pm and 10pm",
  },
  {
    date: "2026-08-01",
    venue: "Chicago Jazz Festival",
    city: "Chicago",
    state: "IL",
    country: "US",
    status: "past",
  },
];
