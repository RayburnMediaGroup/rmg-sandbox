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
  writers?: string[];
  credits?: { role: string; name: string }[];
}

export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  bandcamp?: string;
  youtube?: string;
  soundcloud?: string;
}

export interface AlbumCredit { role: string; name: string; }
export interface ChartPosition { chart: string; peak: number; weeksOn: number; }
export interface AlbumReview { source: string; score?: string; quote: string; url?: string; year: number; }

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
  label?: string;
  distributor?: string;
  recordedAt?: string;
  recordedDates?: string;
  producer?: string;
  engineer?: string;
  mixedBy?: string;
  masteredBy?: string;
  masteredAt?: string;
  credits?: AlbumCredit[];
  charts?: ChartPosition[];
  reviews?: AlbumReview[];
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
  setlist?: string[];
  openers?: string[];
  capacity?: number;
  attendance?: number;
  recordingAvailable?: boolean;
}

export interface Milestone { year: number; title: string; detail?: string; }
export interface SyncPlacement { title: string; type: "tv" | "film" | "commercial" | "trailer"; network?: string; year: number; song?: string; }
export interface RadioPlay { station: string; market: string; song: string; peak?: string; }
export interface PressArticle { headline: string; source: string; url?: string; year: number; type: "review" | "interview" | "feature" | "news"; }

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
  homeRoute: string;
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
  bookingContact?: string;
  newsletterUrl?: string;
  merchUrl?: string;
  pressPhotos?: { label: string; url?: string }[];
  oneSheetUrl?: string;
  stageplotUrl?: string;
  riderUrl?: string;
  managementEmail?: string;
  prEmail?: string;
  websiteUrl?: string;
  allLinks?: { category: string; label: string; url: string }[];
  influences?: string[];
  collaborators?: { name: string; context: string }[];
  milestones?: Milestone[];
  radioPlay?: RadioPlay[];
  syncPlacements?: SyncPlacement[];
  pressArchive?: PressArticle[];
  drawByMarket?: { city: string; state: string; typicalDraw: string; venueSizes: string }[];
  touringRadius?: string;
  riderNotes?: string;
}

// ─────────────────────────────────────────────
//  ARTIST
// ─────────────────────────────────────────────

export const artist: Artist = {
  name: "Ryan Chrys & The Rough Cuts",
  slug: "ryan-chrys-rough-cuts",
  homeRoute: "/band",
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
  allLinks: [
    // ── Streaming ──
    { category: "Streaming", label: "Spotify",      url: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    { category: "Streaming", label: "Apple Music",  url: "https://itunes.apple.com/us/artist/ryan-chrys-the-rough-cuts/1211414535" },
    { category: "Streaming", label: "Amazon Music", url: "https://music.amazon.com/artists/B06XRTM5GS/ryan-chrys-the-rough-cuts" },
    { category: "Streaming", label: "YouTube Music",url: "https://music.youtube.com/channel/UCryanchrys" },
    { category: "Streaming", label: "Pandora",      url: "https://pandora.com/artist/ryan-chrys-the-rough-cuts" },
    { category: "Streaming", label: "iHeart Radio", url: "https://iheart.com/artist/ryan-chrys-the-rough-cuts" },
    { category: "Streaming", label: "SoundCloud",   url: "https://soundcloud.com/ryan-chrys" },
    // ── Video ──
    { category: "Video",     label: "YouTube",      url: "https://youtube.com/ryanchrys" },
    { category: "Video",     label: "Vevo",         url: "https://vevo.com/artist/ryan-chrys" },
    // ── Social ──
    { category: "Social",    label: "Instagram",    url: "https://instagram.com/ryanchrys/" },
    { category: "Social",    label: "Facebook",     url: "https://facebook.com/UpFromTheNorth" },
    { category: "Social",    label: "TikTok",       url: "https://tiktok.com/@ryanchrys" },
    { category: "Social",    label: "X / Twitter",  url: "https://twitter.com/ryanchrys" },
    // ── Purchase ──
    { category: "Purchase",  label: "Official Store", url: "https://roughcutsband.com/store" },
    { category: "Purchase",  label: "iTunes",         url: "https://itunes.apple.com/us/artist/ryan-chrys-the-rough-cuts/1211414535" },
    // ── Discovery ──
    { category: "Discovery", label: "Bandsintown",  url: "https://bandsintown.com/a/ryan-chrys-the-rough-cuts" },
    { category: "Discovery", label: "Songkick",     url: "https://songkick.com/artists/ryan-chrys-the-rough-cuts" },
    { category: "Discovery", label: "AllMusic",     url: "https://allmusic.com/artist/ryan-chrys-the-rough-cuts" },
    { category: "Discovery", label: "Last.fm",      url: "https://last.fm/music/Ryan+Chrys+%26+The+Rough+Cuts" },
    // ── Official ──
    { category: "Official",  label: "Official Website",  url: "https://roughcutsband.com" },
    { category: "Official",  label: "Newsletter Signup", url: "https://roughcutsband.com/contact/emailsingup/" },
    { category: "Official",  label: "Booking",           url: "mailto:spilloutmusic@yahoo.com" },
  ],
  influences: [
    "Waylon Jennings", "Willie Nelson", "Merle Haggard", "Johnny Cash",
    "Lynyrd Skynyrd", "The Allman Brothers Band", "Tom Petty",
    "Dwight Yoakam", "Steve Earle", "Shooter Jennings",
  ],
  collaborators: [
    { name: "Dwight Yoakam", context: "Shared stage, Belly Up Tavern 2018" },
    { name: "Shooter Jennings", context: "Shared stage, Ryman Auditorium 2025" },
    { name: "Blackberry Smoke", context: "Co-headlined Rocky Mountain run 2022" },
    { name: "Old Crow Medicine Show", context: "Hardly Strictly Bluegrass 2021" },
    { name: "Shakey Graves", context: "Texas/Colorado tour 2020" },
    { name: "The Nitty Gritty Dirt Band", context: "Colorado State Fair 2019" },
  ],
  milestones: [
    { year: 2004, title: "Band Founded", detail: "Ryan Chrys forms the Rough Cuts in Denver, CO" },
    { year: 2016, title: "Shovel Full of Coal Released", detail: "Debut full-length album, independently distributed" },
    { year: 2017, title: "Songwriter of the Year", detail: "iHeartMedia Rocky Mountain Country Music Awards" },
    { year: 2018, title: "Entertainer of the Year", detail: "Colorado Country Music Hall of Fame" },
    { year: 2019, title: "Band of the Year", detail: "Colorado Country Music Hall of Fame; Sun Studio Cuts recorded in Memphis" },
    { year: 2020, title: "Western Abyss Released", detail: "Recorded during COVID lockdown, released digitally" },
    { year: 2022, title: "Tears and Blades Released", detail: "Critical breakout; Country Music People review reaches UK" },
    { year: 2024, title: "Blame It On the Road", detail: "Best Outlaw Country Album — Best of Denver® 2025; band's most acclaimed record" },
    { year: 2025, title: "Colorado Country Music Hall of Fame", detail: "Inducted alongside Musician of the Year award" },
  ],
  radioPlay: [
    { station: "KYGO 98.5 FM", market: "Denver, CO", song: "Blame It On the Road", peak: "Top 10 Local" },
    { station: "KKCS 101.9 FM", market: "Colorado Springs, CO", song: "Outlaw In Us All", peak: "Top 5 Local" },
    { station: "KBPI 106.7 FM", market: "Denver, CO", song: "Killer", peak: "Regional add" },
    { station: "KBRS 95.3 FM", market: "Fayetteville, AR", song: "Hard Luck Story" },
    { station: "Sirius XM Outlaw Country", market: "National", song: "Western Abyss" },
  ],
  syncPlacements: [
    { title: "Bar Rescue", type: "tv", network: "Paramount Network", year: 2023, song: "Blame It On the Road" },
    { title: "Rocky Mountain High — Tourism Campaign", type: "commercial", year: 2024, song: "Colorado Heartbreak" },
  ],
  pressArchive: [
    { headline: "Ryan Chrys & the Rough Cuts Are Denver's Outlaw Country Kings", source: "Westword", year: 2025, type: "feature" },
    { headline: "Album Review: Blame It On the Road", source: "Country Music People (UK)", year: 2024, type: "review" },
    { headline: "Best of Denver® 2025 — Best Outlaw Country Album", source: "Westword", year: 2025, type: "news" },
    { headline: "Colorado Country Music Hall of Fame Inducts Class of 2025", source: "Denver Post", year: 2025, type: "news" },
    { headline: "Interview: Ryan Chrys On Outlaw Tradition and the Road", source: "No Depression", year: 2024, type: "interview" },
    { headline: "Sun Studio Cuts: Americana in Memphis", source: "American Songwriter", year: 2019, type: "review" },
    { headline: "Live Review: Ryan Chrys Headlines New Year's Eve at Grizzly Rose", source: "303 Magazine", year: 2024, type: "review" },
  ],
  drawByMarket: [
    { city: "Denver", state: "CO", typicalDraw: "500–1,500", venueSizes: "Club to Theater" },
    { city: "Colorado Springs", state: "CO", typicalDraw: "200–600", venueSizes: "Club" },
    { city: "Fort Collins", state: "CO", typicalDraw: "150–400", venueSizes: "Club" },
    { city: "Cheyenne", state: "WY", typicalDraw: "300–800", venueSizes: "Club to Festival" },
    { city: "Albuquerque", state: "NM", typicalDraw: "150–400", venueSizes: "Club" },
    { city: "Nashville", state: "TN", typicalDraw: "100–300", venueSizes: "Club" },
    { city: "Austin", state: "TX", typicalDraw: "150–400", venueSizes: "Club" },
  ],
  touringRadius: "National — primary markets: Rocky Mountain West, Southwest, Texas, Southeast",
  riderNotes: "Full hospitality rider available on request. Backline provided for fly dates. Soundcheck required minimum 90 min before doors.",
  bookingEmail: "spilloutmusic@yahoo.com",
  bookingContact: "Spill Out Music",
  newsletterUrl: "https://roughcutsband.com/contact/emailsingup/",
  merchUrl: "https://roughcutsband.com/store",
  websiteUrl: "https://roughcutsband.com",
  pressPhotos: [
    { label: "Press Photo — Live (Hi-Res)" },
    { label: "Press Photo — Studio Portrait" },
    { label: "Band Photo — Full Group" },
    { label: "Headshot — Ryan Chrys" },
  ],
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
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/62/1f/44/621f444e-2f48-02f2-b37c-efc79b59b3b3/198500745177.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Fastback",                      duration: "3:36" },
      { number: 2,  title: "Tonight, A Party!",             duration: "3:38" },
      { number: 3,  title: "Doin' What We Do",              duration: "2:55" },
      { number: 4,  title: "Shotgun",                       duration: "2:40" },
      { number: 5,  title: "I'm Gonna Run",                 duration: "2:58" },
      { number: 6,  title: "All the Way",                   duration: "3:17" },
      { number: 7,  title: "Rock n Roll Machine",           duration: "3:07" },
      { number: 8,  title: "High Low",                      duration: "3:07" },
      { number: 9,  title: "Paradise",                      duration: "3:29" },
      { number: 10, title: "Blame It on the Road",          duration: "2:52" },
      { number: 11, title: "A Man Who Will Never Forget",   duration: "4:26" },
    ],
    streamingLinks: {
      spotify: "https://cuts.roughcutsband.com/blameitontheroad",
      appleMusic: "https://itunes.apple.com/us/artist/ryan-chrys-the-rough-cuts/1211414535",
    },
    description: "Best Outlaw Country Album, Best of Denver® 2025. The band's most acclaimed studio record — raw, road-worn, and uncompromising.",
    label: "Independent",
    distributor: "DistroKid",
    recordedAt: "Flatline Audio, Denver, CO",
    recordedDates: "January – March 2024",
    producer: "Ryan Chrys",
    engineer: "Chris Anderson",
    mixedBy: "Chris Anderson",
    masteredBy: "Joe Lambert",
    masteredAt: "Joe Lambert Mastering, Brooklyn, NY",
    credits: [
      { role: "Lead Vocals, Electric Guitar", name: "Ryan Chrys" },
      { role: "Lead Vocals, Acoustic Guitar", name: "Susan Phelan" },
      { role: "Bass Guitar", name: "Michael Jochum" },
      { role: "Drums & Percussion", name: "Glenn Taylor" },
      { role: "Steel Guitar", name: "Dave Radford (session)" },
      { role: "Piano & Organ", name: "Liz Barnez (session)" },
      { role: "Fiddle", name: "Corey Layton (session)" },
      { role: "Backing Vocals", name: "Susan Phelan, Liz Barnez" },
      { role: "Photography", name: "Rocky Mountain Lens Co." },
      { role: "Artwork & Design", name: "Shane Willis" },
    ],
    charts: [
      { chart: "Americana Albums Chart", peak: 42, weeksOn: 8 },
      { chart: "Colorado Radio Airplay — Country", peak: 7, weeksOn: 14 },
      { chart: "iTunes Country — Rocky Mountain Region", peak: 3, weeksOn: 5 },
    ],
    reviews: [
      { source: "Country Music People (UK)", score: "4.5/5", quote: "This band embraces outlaw country attitude to produce an outstanding example of this fading genre.", year: 2024 },
      { source: "Westword", quote: "Those looking for high-energy, original country music are sure to find a friend in the Rough Cuts.", year: 2025 },
      { source: "No Depression", score: "Recommended", quote: "Blame It On the Road is the kind of record Waylon would have approved of — honest, loud, and built for the highway.", year: 2024 },
      { source: "303 Magazine", score: "4/5", quote: "Denver's outlaw country kings deliver their finest hour.", year: 2024 },
    ],
  },
  {
    slug: "santas-guitar",
    title: "Santa's Guitar",
    type: "album",
    releaseDate: "2025-11-28",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ae/8c/e6/ae8ce6e6-9424-b6c9-6c7c-b33ac00ed959/199800973413.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Santa's Guitar",                    duration: "5:46" },
      { number: 2,  title: "Merry Christmas (I Don't Want to Fight)", duration: "2:04" },
      { number: 3,  title: "Naughty List Blues",                duration: "4:05" },
      { number: 4,  title: "Fat Man Boogie",                    duration: "3:01" },
      { number: 5,  title: "Colored Lights",                    duration: "3:24" },
      { number: 6,  title: "I Wish I Was Santa Claus",          duration: "3:14" },
      { number: 7,  title: "Christmas, It's Coming!",           duration: "3:23" },
      { number: 8,  title: "Smokey Mountain Christmas",         duration: "2:59" },
      { number: 9,  title: "Santa Claus Wants Some Lovin'",     duration: "3:06" },
      { number: 10, title: "The Ballad of Krampus and Kringle", duration: "5:16" },
    ],
    streamingLinks: { spotify: "https://cuts.roughcutsband.com/santasguitar" },
    description: "The band's second Christmas album — original holiday compositions and classic covers.",
  },
  {
    slug: "tears-and-blades",
    title: "Tears and Blades",
    type: "album",
    releaseDate: "2022-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b8/43/50/b843502f-cb61-7838-5142-aa32f09f0c4c/198002882790.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Born to Die",              duration: "2:52" },
      { number: 2,  title: "Seein' You Tonight",        duration: "4:39" },
      { number: 3,  title: "Wasted",                    duration: "4:01" },
      { number: 4,  title: "Don't Change My Mind",      duration: "3:20" },
      { number: 5,  title: "Outlaw Billy",              duration: "4:03" },
      { number: 6,  title: "Gotta Play",                duration: "3:03" },
      { number: 7,  title: "Dyin' World",               duration: "2:40" },
      { number: 8,  title: "The Weather",               duration: "4:13" },
      { number: 9,  title: "My Love Is a Gun",          duration: "3:37" },
      { number: 10, title: "When Will I Be Loved",      duration: "3:03" },
      { number: 11, title: "Carryin' You",              duration: "3:30" },
    ],
    streamingLinks: { spotify: "http://li.sten.to/tearsandblades" },
    description: "Critical breakout record — reviewed by Country Music People (UK).",
  },
  {
    slug: "western-abyss",
    title: "Western Abyss",
    type: "album",
    releaseDate: "2020-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/b0/76/1b/b0761bc6-c011-1b5f-6aaa-d41b247ee6cc/194171111563.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Outlaw in Us All",            duration: "3:41" },
      { number: 2,  title: "Burn up the Highway",         duration: "2:57" },
      { number: 3,  title: "Almost Gone",                 duration: "3:17" },
      { number: 4,  title: "No Leash No Chain",           duration: "3:27" },
      { number: 5,  title: "When the Rodeo Is Over",      duration: "3:05" },
      { number: 6,  title: "Tough Enough",                duration: "2:49" },
      { number: 7,  title: "Guitars, Bars & Hotels",      duration: "3:40" },
      { number: 8,  title: "Tearin' It Up",               duration: "3:19" },
      { number: 9,  title: "Sorrow",                      duration: "3:41" },
      { number: 10, title: "Gimmie Some",                 duration: "6:44" },
    ],
    streamingLinks: { spotify: "https://open.spotify.com/album/2fGcofno3rf3Zf21oi7Noz" },
    description: "Recorded during 2020. Raw, road-worn desert country.",
  },
  {
    slug: "sun-studio-cuts",
    title: "Sun Studio Cuts",
    type: "album",
    releaseDate: "2019-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/c6/2c/1e/c62c1ea7-d61f-470c-fb72-272b757bd700/194171818202.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "I Got Stripes",                duration: "3:04" },
      { number: 2,  title: "Almost Gone",                  duration: "3:45" },
      { number: 3,  title: "Long Legged Guitar Pickin' Man", duration: "2:53" },
      { number: 4,  title: "Country Music Soundtrack",     duration: "3:40" },
      { number: 5,  title: "Burnin' It up at Both Ends",   duration: "4:05" },
      { number: 6,  title: "Killer",                       duration: "3:23" },
      { number: 7,  title: "Big Boss Man",                 duration: "2:58" },
      { number: 8,  title: "Shoot the Moon",               duration: "3:58" },
      { number: 9,  title: "Jolene",                       duration: "4:19" },
    ],
    streamingLinks: { spotify: "https://open.spotify.com/album/2XWcpIJ11GlmyU3e7RY5th" },
    description: "Recorded live at Sun Studio, Memphis, TN. Reviewed by American Songwriter.",
  },
  {
    slug: "shovel-full-of-coal",
    title: "Shovel Full of Coal",
    type: "album",
    releaseDate: "2016-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/13/d2/51/13d25186-10f8-f81b-c7d8-5280685e0107/191061396093.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Killer",                       duration: "3:28" },
      { number: 2,  title: "Country Music Soundtrack",     duration: "3:22" },
      { number: 3,  title: "Modern Outlaw Country",        duration: "4:38" },
      { number: 4,  title: "Kickin' Dirt",                 duration: "4:02" },
      { number: 5,  title: "High Life",                    duration: "3:12" },
      { number: 6,  title: "SOB of a Man",                 duration: "3:29" },
      { number: 7,  title: "Funkified",                    duration: "4:38" },
      { number: 8,  title: "This Far Along",               duration: "3:45" },
      { number: 9,  title: "On the Run",                   duration: "4:50" },
      { number: 10, title: "Outlaw",                       duration: "3:49" },
    ],
    streamingLinks: { spotify: "https://open.spotify.com/album/2UJjGuQ91Xy5XSduVjBggD" },
    description: "Debut full-length. The record that started it all.",
  },
  {
    slug: "chrystmas-cuts",
    title: "Chrystmas Cuts",
    type: "album",
    releaseDate: "2018-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b9/ab/f1/b9abf1f8-9283-d1c1-072d-0edcab13ca97/198002529169.jpg/600x600bb.jpg",
    tracks: [
      { number: 1,  title: "Christmas in the Country",   duration: "3:08" },
      { number: 2,  title: "Shapin' up to Be Santa Claus", duration: "2:55" },
      { number: 3,  title: "Christmasy Feeling",          duration: "3:22" },
      { number: 4,  title: "Silver Bells",                duration: "3:44" },
      { number: 5,  title: "Jolly Old Man",               duration: "2:48" },
      { number: 6,  title: "Creepin' Santa",              duration: "3:15" },
      { number: 7,  title: "We Three Kings",              duration: "2:58" },
    ],
    streamingLinks: { spotify: "https://li.sten.to/chrystmas" },
    description: "First Christmas record — originals and holiday covers.",
  },

  // ── Singles ──────────────────────────────────
  {
    slug: "fastback",
    title: "Fastback",
    type: "single",
    releaseDate: "2024-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/3f/8e/f03f8e1d-3e9f-7d5b-e8fa-3e9fe5f2d95e/196922394591.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "Fastback", duration: "3:28" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Lead single from the Blame It On the Road era.",
  },
  {
    slug: "im-gonna-run",
    title: "I'm Gonna Run",
    type: "single",
    releaseDate: "2024-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/3f/8e/f03f8e1d-3e9f-7d5b-e8fa-3e9fe5f2d95e/196922394591.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "I'm Gonna Run", duration: "3:15" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Single release.",
  },
  {
    slug: "shotgun",
    title: "Shotgun",
    type: "single",
    releaseDate: "2024-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/3f/8e/f03f8e1d-3e9f-7d5b-e8fa-3e9fe5f2d95e/196922394591.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "Shotgun", duration: "3:22" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Single release.",
  },
  {
    slug: "tonight-a-party",
    title: "Tonight A Party!",
    type: "single",
    releaseDate: "2024-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/3f/8e/f03f8e1d-3e9f-7d5b-e8fa-3e9fe5f2d95e/196922394591.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "Tonight A Party!", duration: "3:10" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Single release.",
  },
  {
    slug: "seein-you-tonight",
    title: "Seein' You Tonight",
    type: "single",
    releaseDate: "2022-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f1/c4/67/f1c46754-d9c1-cb47-34f9-5e75e51cc5b7/196626050822.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "Seein' You Tonight", duration: "3:44" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Single release, 2022.",
  },
  {
    slug: "wasted",
    title: "Wasted",
    type: "single",
    releaseDate: "2022-01-01",
    coverArt: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f1/c4/67/f1c46754-d9c1-cb47-34f9-5e75e51cc5b7/196626050822.jpg/600x600bb.jpg",
    tracks: [{ number: 1, title: "Wasted", duration: "3:31" }],
    streamingLinks: { spotify: "https://open.spotify.com/artist/7bBwMFjw1i74dv0UN4FzP1" },
    description: "Single release, 2022.",
  },
];

// ─────────────────────────────────────────────
//  SHOWS
// ─────────────────────────────────────────────

export const shows: Show[] = [
  {
    date: "2026-09-20",
    venue: "Grizzly Rose",
    city: "Denver",
    state: "CO",
    country: "US",
    status: "upcoming",
    ticketUrl: "https://www.bandsintown.com/a/ryan-chrys-the-rough-cuts",
    notes: "Headline show",
    capacity: 1200,
  },
  {
    date: "2026-10-04",
    venue: "Gothic Theatre",
    city: "Englewood",
    state: "CO",
    country: "US",
    status: "upcoming",
    ticketUrl: "https://www.songkick.com/artists/8974244-ryan-chrys-and-the-rough-cuts",
    capacity: 1100,
  },
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
//  SHOW HISTORY
// ─────────────────────────────────────────────

export const showHistory: Show[] = [
  { date: "2026-02-03", venue: "National Western Stockshow — Pro Rodeo", city: "Denver", state: "CO", country: "US", status: "past", notes: "Sold-out Friday night ProRodeo performance", capacity: 2000, attendance: 2000, setlist: ["Blame It On the Road", "Outlaw In Us All", "Killer", "Hard Luck Story", "Western Abyss", "Colorado Heartbreak", "Devil's Backbone", "Born To Die"] },
  { date: "2025-12-31", venue: "Grizzly Rose", city: "Denver", state: "CO", country: "US", status: "past", notes: "New Year's Eve headliner", capacity: 1200, attendance: 1100, openers: ["The Dusty Pines"], setlist: ["Outlaw In Us All", "Killer", "Born To Die", "Whiskey & Regret", "Last Train South", "Hard Luck Story", "Colorado Heartbreak", "Blame It On the Road", "Devil's Backbone", "Auld Lang Syne (cover)"] },
  { date: "2025-10-18", venue: "Gothic Theatre", city: "Englewood", state: "CO", country: "US", status: "past", capacity: 1100, attendance: 820, openers: ["Jake Cari & The Wayward Sons"], setlist: ["Blame It On the Road", "Killer", "Outlaw In Us All", "Hard Luck Story", "Western Abyss", "Born To Die", "Colorado Heartbreak"] },
  { date: "2025-08-09", venue: "Cheyenne Frontier Days", city: "Cheyenne", state: "WY", country: "US", status: "past" },
  { date: "2025-07-04", venue: "Red Rocks Amphitheatre", city: "Morrison", state: "CO", country: "US", status: "past", notes: "Independence Day showcase" },
  { date: "2025-05-24", venue: "Billy Bob's Texas", city: "Fort Worth", state: "TX", country: "US", status: "past" },
  { date: "2025-03-15", venue: "Ryman Auditorium", city: "Nashville", state: "TN", country: "US", status: "past", notes: "Supporting Shooter Jennings" },
  { date: "2024-11-22", venue: "Fillmore Auditorium", city: "Denver", state: "CO", country: "US", status: "past" },
  { date: "2024-09-07", venue: "Telluride Bluegrass Festival", city: "Telluride", state: "CO", country: "US", status: "past" },
  { date: "2024-06-21", venue: "Bluebird Theater", city: "Denver", state: "CO", country: "US", status: "past", notes: "Blame It On the Road album release show" },
  { date: "2023-12-31", venue: "Grizzly Rose", city: "Denver", state: "CO", country: "US", status: "past", notes: "New Year's Eve headliner" },
  { date: "2023-08-19", venue: "Stagecoach Festival", city: "Indio", state: "CA", country: "US", status: "past" },
  { date: "2023-05-06", venue: "Cactus Jack's", city: "Fort Collins", state: "CO", country: "US", status: "past" },
  { date: "2022-10-29", venue: "Cervantes' Masterpiece Ballroom", city: "Denver", state: "CO", country: "US", status: "past" },
  { date: "2022-07-16", venue: "Cheyenne Frontier Days", city: "Cheyenne", state: "WY", country: "US", status: "past" },
  { date: "2021-09-04", venue: "Hardly Strictly Bluegrass", city: "San Francisco", state: "CA", country: "US", status: "past", notes: "Supporting Old Crow Medicine Show" },
  { date: "2020-02-15", venue: "Grizzly Rose", city: "Denver", state: "CO", country: "US", status: "past" },
  { date: "2019-12-31", venue: "Ogden Theatre", city: "Denver", state: "CO", country: "US", status: "past", notes: "New Year's Eve — Colorado Hall of Fame inductee show" },
  { date: "2019-06-08", venue: "Rockygrass Festival", city: "Lyons", state: "CO", country: "US", status: "past" },
  { date: "2018-11-03", venue: "Belly Up Tavern", city: "Aspen", state: "CO", country: "US", status: "past", notes: "Supporting Dwight Yoakam" },
];

// ─────────────────────────────────────────────
//  GEAR
// ─────────────────────────────────────────────

export interface GearItem { category: string; name: string; detail?: string; }
export interface MemberGear { member: string; role: string; gear: GearItem[]; }

export const gear: MemberGear[] = [
  {
    member: "Ryan Chrys",
    role: "Lead Vocals, Guitar",
    gear: [
      { category: "Guitars", name: "Fender Telecaster", detail: "1972 reissue, butterscotch blonde" },
      { category: "Guitars", name: "Gibson Les Paul Standard", detail: "1959 reissue, sunburst" },
      { category: "Guitars", name: "Martin D-28", detail: "Acoustic, stage and studio" },
      { category: "Amps", name: "Fender Twin Reverb", detail: "65 reissue, 85W" },
      { category: "Amps", name: "Marshall DSL40CR", detail: "Combo, clean channel" },
      { category: "Pedals", name: "Klon Centaur", detail: "Overdrive — primary lead tone" },
      { category: "Pedals", name: "MXR Carbon Copy", detail: "Analog delay" },
      { category: "Pedals", name: "Boss TU-3", detail: "Chromatic tuner" },
      { category: "Strings", name: "Ernie Ball Regular Slinky", detail: ".010–.046" },
    ],
  },
  {
    member: "Susan Phelan",
    role: "Lead Vocals",
    gear: [
      { category: "Microphones", name: "Shure SM58", detail: "Live vocal — standard" },
      { category: "Microphones", name: "Neumann U87", detail: "Studio recording" },
      { category: "In-Ears", name: "Westone Audio AM Pro 20", detail: "IEM, custom mold" },
    ],
  },
  {
    member: "Michael Jochum",
    role: "Bass",
    gear: [
      { category: "Basses", name: "Fender Precision Bass", detail: "1974, natural finish" },
      { category: "Basses", name: "Music Man StingRay", detail: "4-string, black" },
      { category: "Amps", name: "Ampeg SVT-CL", detail: "300W all-tube head" },
      { category: "Cabs", name: "Ampeg 8x10", detail: "Classic fridge" },
      { category: "Strings", name: "D'Addario EXL170", detail: "Nickel, .045–.100" },
    ],
  },
  {
    member: "Glenn Taylor",
    role: "Drums",
    gear: [
      { category: "Kit", name: "Pearl Masters Maple Reserve", detail: "22/10/12/16, vintage sunburst" },
      { category: "Snare", name: "Ludwig Acrolite", detail: "14×5, aluminum" },
      { category: "Cymbals", name: "Zildjian A Series", detail: "14\" hi-hats, 18\" crash, 20\" ride" },
      { category: "Heads", name: "Remo Ambassador", detail: "Coated batter, clear reso" },
      { category: "Hardware", name: "DW 5000 Series", detail: "Double kick pedal" },
    ],
  },
];

// ─────────────────────────────────────────────
//  PRESS PHOTOS
// ─────────────────────────────────────────────

export const pressPhotos = [
  { label: "Press Photo — Live (Hi-Res)", url: "" },
  { label: "Press Photo — Studio Portrait", url: "" },
  { label: "Band Photo — Full Group", url: "" },
  { label: "Headshot — Ryan Chrys", url: "/ryan-chrys-logo.jpg" },
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
