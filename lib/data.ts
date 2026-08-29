// ─────────────────────────────────────────────
//  BandStack · Seed Data
//  Ryan Chrys & The Rough Cuts
// ─────────────────────────────────────────────

export interface Member {
  name: string;
  role: string;
  image?: string;
}

export interface Track {
  number: number;
  title: string;
  duration?: string;
  audioSrc?: string;
  lyrics?: string;
}

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  bandcamp?: string;
  youtube?: string;
  soundcloud?: string;
}

export interface Release {
  slug: string;
  title: string;
  type: "album" | "ep" | "single" | "live";
  releaseDate: string;
  coverArt?: string;
  tracks: Track[];
  streamingLinks: StreamingLinks;
  description?: string;
  isFeatured?: boolean;
}

export interface Show {
  date: string;
  venue: string;
  city: string;
  state?: string;
  country: string;
  ticketUrl?: string;
  status: "upcoming" | "past" | "sold-out" | "cancelled";
  isFeatured?: boolean;
  notes?: string;
}

export interface PressQuote {
  quote: string;
  source: string;
  url?: string;
  year: number;
}

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface Artist {
  name: string;
  slug: string;
  tagline: string;
  bio: string[];
  origin: string;
  genre: string[];
  founded: number;
  members: Member[];
  pressQuotes: PressQuote[];
  awards: string[];
  socialLinks: SocialLinks;
  streamingLinks: StreamingLinks;
  bookingEmail?: string;
  newsletterUrl?: string;
  merchUrl?: string;
}

// ─────────────────────────────────────────────
//  ARTIST
// ─────────────────────────────────────────────

export const artist: Artist = {
  name: "Ryan Chrys & The Rough Cuts",
  slug: "ryan-chrys-rough-cuts",
  tagline: "Modern outlaw country. Denver-born. Road-hardened.",
  bio: [
    "Ryan Chrys & The Rough Cuts are a 4-piece touring ensemble from Denver, Colorado, blending the soul of traditional outlaw country with the voltage of 70s rock. Overdriven guitars, twin lead vocals, and two decades of stages have forged one of the most decorated acts in the Rocky Mountain music scene.",
    "Inspired by Waylon Jennings, Willie Nelson, and the outlaw tradition, the band brings a rock-and-roll attitude to country music without abandoning its roots. Ryan Chrys handles lead vocals and guitar alongside Susan Phelan, whose voice gives the band its signature dual-lead sound.",
    "After 20+ years of touring, the Rough Cuts have shared stages with Dwight Yoakam, Shooter Jennings, Blackberry Smoke, Old Crow Medicine Show, The Nitty Gritty Dirt Band, and Shakey Graves. In 2025, the band was inducted into the Colorado Country Music Hall of Fame.",
  ],
  origin: "Denver, Colorado",
  genre: ["outlaw country", "country rock", "americana"],
  founded: 2004,
  members: [
    { name: "Ryan Chrys", role: "Lead Vocals, Guitar" },
    { name: "Susan Phelan", role: "Lead Vocals" },
    { name: "Michael Jochum", role: "Band Member" },
    { name: "Glenn Taylor", role: "Band Member" },
  ],
  pressQuotes: [
    {
      quote: "Those looking for high-energy, original country music are sure to find a friend in the Rough Cuts.",
      source: "Westword",
      url: "https://www.westword.com",
      year: 2026,
    },
    {
      quote: "This band embraces outlaw country attitude to produce an outstanding example of this fading genre.",
      source: "Country Music People",
      year: 2024,
    },
    {
      quote: "A guitarist's guitarist, a country rock ax man.",
      source: "The Denver Post",
      year: 2023,
    },
  ],
  awards: [
    "Colorado Country Music Hall of Fame Inductees, 2025",
    "Musician of the Year — Mountain West Country Music Association, 2025",
    "Best Outlaw Country Album — Best of Denver®, 2025",
    "Band of the Year — Colorado Country Music Hall of Fame, 2019",
    "Entertainer of the Year — Colorado Country Music Hall of Fame, 2018",
    "Songwriter of the Year — iHeartMedia Rocky Mountain Country Music Awards, 2017",
  ],
  socialLinks: {
    instagram: "https://instagram.com/ryanchrys/",
    tiktok: "https://tiktok.com/@ryanchrys",
    facebook: "https://facebook.com/UpFromTheNorth",
    twitter: "https://twitter.com/ryanchrys",
    youtube: "https://youtube.com/ryanchrys",
  },
  streamingLinks: {
    spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1",
    appleMusic: "https://itunes.apple.com/us/artist/ryan-chrys-the-rough-cuts/1211414535",
    youtube: "https://youtube.com/ryanchrys",
  },
  bookingEmail: "spilloutmusic@yahoo.com",
  newsletterUrl: "https://roughcutsband.com/contact/emailsingup/",
  merchUrl: "https://roughcutsband.com/store",
};

// ─────────────────────────────────────────────
//  RELEASES
// ─────────────────────────────────────────────

export const releases: Release[] = [
  {
    slug: "blame-it-on-the-road",
    title: "Blame It On the Road",
    type: "album",
    releaseDate: "2024-06-21",
    isFeatured: true,
    tracks: [
      { number: 1,  title: "Blame It On the Road",    duration: "3:42" },
      { number: 2,  title: "Outlaw In Us All",         duration: "4:11" },
      { number: 3,  title: "Killer",                   duration: "3:28" },
      { number: 4,  title: "Born To Die",              duration: "4:55" },
      { number: 5,  title: "Hard Luck Story",          duration: "3:17" },
      { number: 6,  title: "Whiskey & Regret",         duration: "4:02" },
      { number: 7,  title: "Last Train South",         duration: "3:54" },
      { number: 8,  title: "Devil's Backbone",         duration: "5:08" },
      { number: 9,  title: "Colorado Heartbreak",      duration: "3:33" },
      { number: 10, title: "Blame It On the Road (Reprise)", duration: "2:14" },
    ],
    streamingLinks: {
      spotify: "https://cuts.roughcutsband.com/blameitontheroad",
    },
    description: "Best Outlaw Country Album, Best of Denver® 2025. The band's most acclaimed studio record — raw, road-worn, and uncompromising.",
  },
  {
    slug: "santas-guitar",
    title: "Santa's Guitar",
    type: "album",
    releaseDate: "2025-11-28",
    tracks: [],
    streamingLinks: {
      spotify: "https://cuts.roughcutsband.com/santasguitar",
    },
    description: "The band's second Christmas album — six original holiday compositions and four covers.",
  },
  {
    slug: "tears-and-blades",
    title: "Tears and Blades",
    type: "album",
    releaseDate: "2022-01-01",
    tracks: [],
    streamingLinks: {
      spotify: "http://li.sten.to/tearsandblades",
    },
  },
  {
    slug: "western-abyss",
    title: "Western Abyss",
    type: "album",
    releaseDate: "2020-01-01",
    tracks: [],
    streamingLinks: {
      spotify: "https://open.spotify.com/album/2fGcofno3rf3Zf21oi7Noz",
    },
  },
  {
    slug: "sun-studio-cuts",
    title: "Sun Studio Cuts",
    type: "album",
    releaseDate: "2019-01-01",
    tracks: [],
    streamingLinks: {
      spotify: "https://open.spotify.com/album/2XWcpIJ11GlmyU3e7RY5th",
    },
  },
  {
    slug: "shovel-full-of-coal",
    title: "Shovel Full of Coal",
    type: "album",
    releaseDate: "2016-01-01",
    tracks: [],
    streamingLinks: {
      spotify: "https://open.spotify.com/album/2UJjGuQ91Xy5XSduVjBggD",
    },
  },
  {
    slug: "chrystmas-cuts",
    title: "Chrystmas Cuts",
    type: "album",
    releaseDate: "2018-01-01",
    tracks: [],
    streamingLinks: {
      spotify: "https://li.sten.to/chrystmas",
    },
  },
];

// ─────────────────────────────────────────────
//  SHOWS
// ─────────────────────────────────────────────

export const shows: Show[] = [
  {
    date: "2026-02-03",
    venue: "National Western Stockshow — Pro Rodeo",
    city: "Denver",
    state: "CO",
    country: "US",
    status: "past",
    notes: "Sold-out Friday night ProRodeo performance",
  },
];

// ─────────────────────────────────────────────
//  VIDEOS
// ─────────────────────────────────────────────

export const videos = [
  { title: "Outlaw In Us All (Official Music Video)", youtubeId: "CwwLHDnQqnE" },
  { title: "Modern Outlaw Country (Official Music Video)", youtubeId: "" },
  { title: "Country Music Soundtrack (Official Music Video)", youtubeId: "" },
  { title: "Killer (Official Music Video)", youtubeId: "pUqJx9HhqRc" },
  { title: "Born To Die (Official Music Video)", youtubeId: "Wvh1R_0ddD0" },
  { title: "Almost Gone (Official Music Video)", youtubeId: "" },
  { title: "Fastback", youtubeId: "" },
  { title: "Tonight, A Party!", youtubeId: "" },
  { title: "Too Many Nights In A Roadhouse (Live 2025)", youtubeId: "" },
  { title: "Live Video Clips Reel 2025", youtubeId: "" },
];
