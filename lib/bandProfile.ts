import { artist, releases as dataReleases, shows as dataShows, gear as dataGear, videos as dataVideos, showHistory as dataShowHistory, type GearItem } from "@/lib/data";

export interface ProfileMember { name: string; role: string; }
export interface ProfileTrack { number: number; title: string; duration?: string; lyrics?: string; }
export interface ProfileRelease {
  title: string; type: "album" | "ep" | "single" | "live";
  year: string; description: string; spotifyUrl: string; coverArt: string;
  tracks?: ProfileTrack[];
}
export interface ProfileShow {
  date: string; venue: string; city: string; state?: string;
  ticketUrl?: string; status?: string; notes?: string;
  setlist?: string[];
}
export interface ProfileLink { label: string; url: string; category: string; }
export interface ProfileGearMember { member: string; role: string; gear: GearItem[]; }

export type SyncLicensingStatus = "available" | "partial" | "unavailable";
export interface SyncTrack {
  title: string;
  albumTitle?: string;
  isrc?: string;
  bpm?: number;
  musicalKey?: string;
  duration?: string;
  mood: string[];
  theme: string[];
  instrumentation: string[];
  explicit: boolean;
  hasInstrumental: boolean;
  hasStems: boolean;
  licensingStatus: SyncLicensingStatus;
  previewUrl?: string;
  spotifyUrl?: string;
  notes?: string;
}
export interface SyncProfile {
  pro?: string;
  publisher?: string;
  ipiNumber?: string;
  contactName?: string;
  contactEmail?: string;
  syncReelUrl?: string;
  stemFilesAvailable: boolean;
  instrumentalVersionsAvailable: boolean;
  tracks: SyncTrack[];
}

export type VenueRelationship = "played" | "hold" | "pitched" | "target" | "avoid";
export interface VenueShowEntry { date: string; guarantee?: string; draw?: number; notes?: string; }
export interface VenueRecord {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity?: number;
  venueType?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  typicalGuarantee?: string;
  relationship: VenueRelationship;
  notes?: string;
  history: VenueShowEntry[];
}

export interface ProfileData {
  name: string; contactEmail: string; genre: string; tagline: string;
  origin: string; founded: string; bio: string;
  members: ProfileMember[];
  releases: ProfileRelease[];
  shows: ProfileShow[];
  bookingEmail: string; bookingContact?: string;
  instagram: string; spotify: string; appleMusic: string;
  youtube?: string; facebook?: string; tiktok?: string;
  heroImage: string; coverImage?: string; albumArt: string;
  colorMode: "dark" | "light";
  merchUrl?: string;
  pressQuotes?: { quote: string; source: string; year?: number }[];
  awards?: string[];
  links?: ProfileLink[];
  gear?: ProfileGearMember[];
  videos?: { title: string; youtubeId: string; date: string }[];
  photos?: { url: string; label: string }[];
  posters?: { url: string; label: string; showDate?: string; venue?: string }[];
  venues?: VenueRecord[];
  syncProfile?: SyncProfile;
  mailingListCount?: number;
  appleMusicArtistId?: string | number;
  youtubeChannelId?: string;
  showHistory?: any[];
  milestones?: any[];
  influences?: string[];
  collaborators?: { name: string; context: string }[];
  pressArchive?: any[];
  radioPlay?: any[];
  syncPlacements?: any[];
  drawByMarket?: any[];
  touringRadius?: string;
  riderNotes?: string;
}

export const PROFILE_KEY = "bandstack-profile-v1";

export const BLANK_PROFILE: ProfileData = {
  name: "", contactEmail: "", genre: "", tagline: "", origin: "", founded: "",
  bio: "", members: [], releases: [], shows: [], bookingEmail: "", bookingContact: "",
  instagram: "", spotify: "", appleMusic: "", youtube: "", facebook: "", tiktok: "",
  heroImage: "", coverImage: "", albumArt: "", colorMode: "dark",
  appleMusicArtistId: "", merchUrl: "", pressQuotes: [], awards: [], links: [],
  gear: [], venues: [], videos: [], showHistory: [],
};

export const TEMPLATE_PROFILE: ProfileData = {
  name: "Your Band Name",
  contactEmail: "your@email.com",
  genre: "Rock",
  tagline: "Your tagline here — one sentence that captures your sound.",
  origin: "Your City, ST",
  founded: "2020",
  bio: "Your Band Name is your band info here. Write 2–4 paragraphs about your origin story, your sound, what drives you, and where you've been. This is your artist statement — make it yours.",
  members: [
    { name: "Your Name", role: "Vocals / Guitar" },
    { name: "Band Member", role: "Bass" },
    { name: "Band Member", role: "Drums" },
  ],
  releases: [
    {
      title: "Your Album Title",
      type: "album",
      year: "2024",
      description: "Your album description here — what inspired it, what it sounds like, what it means.",
      spotifyUrl: "",
      coverArt: "",
      tracks: [
        { number: 1, title: "Your Track Title", duration: "3:30" },
        { number: 2, title: "Your Track Title", duration: "4:00" },
        { number: 3, title: "Your Track Title", duration: "3:15" },
      ],
    },
  ],
  shows: [
    { date: "2025-01-15", venue: "Your Venue Name", city: "Your City", state: "ST", ticketUrl: "", status: "upcoming", notes: "Your show notes here" },
    { date: "2025-02-20", venue: "Your Venue Name", city: "Your City", state: "ST", ticketUrl: "", status: "upcoming", notes: "" },
  ],
  bookingEmail: "booking@youremail.com",
  bookingContact: "Your Booking Contact",
  instagram: "",
  spotify: "",
  appleMusic: "",
  youtube: "",
  facebook: "",
  tiktok: "",
  heroImage: "",
  coverImage: "",
  albumArt: "",
  colorMode: "dark",
  appleMusicArtistId: "",
  merchUrl: "",
  pressQuotes: [
    { quote: "Your press quote here — paste a line from a review, interview, or feature.", source: "Publication Name", year: 2024 },
  ],
  awards: ["Your award or recognition here", "Chart position, nomination, or milestone"],
  links: [
    { label: "Official Website", url: "https://yourwebsite.com", category: "web" },
    { label: "Spotify", url: "", category: "streaming" },
    { label: "Apple Music", url: "", category: "streaming" },
  ],
  gear: [
    { member: "Your Name", role: "Guitar", gear: [{ category: "Guitar", name: "Your Guitar" }, { category: "Amp", name: "Your Amp" }] },
    { member: "Band Member", role: "Bass", gear: [{ category: "Bass", name: "Your Bass" }, { category: "Amp", name: "Your Amp" }] },
  ],
  venues: [],
  videos: [
    { title: "Your Video Title", youtubeId: "", date: "" },
  ],
  showHistory: [],
  milestones: ["Your milestone here — first major show, album release, radio play, etc."],
  influences: ["Your Influence", "Your Influence", "Your Influence"],
  syncProfile: {
    pro: "BMI",
    publisher: "Your Publishing Name",
    contactEmail: "sync@youremail.com",
    stemFilesAvailable: false,
    instrumentalVersionsAvailable: false,
    tracks: [
      { title: "Your Track Title", albumTitle: "Your Album", bpm: 120, musicalKey: "G Major", duration: "3:30", mood: ["Your Mood"], theme: ["Your Theme"], instrumentation: ["Guitar", "Bass", "Drums"], explicit: false, hasInstrumental: false, hasStems: false, licensingStatus: "available", notes: "Your licensing notes here." },
    ],
  },
};

export const DEMO_PROFILE: ProfileData = {
  name: artist.name,
  contactEmail: artist.bookingEmail ?? "",
  genre: artist.genre[0] ?? "",
  tagline: artist.tagline,
  origin: artist.origin,
  founded: String(artist.founded),
  bio: artist.bio.join(" "),
  members: artist.members.map(m => ({ name: m.name, role: m.role })),
  releases: dataReleases.map(r => ({
    slug: r.slug,
    title: r.title,
    type: r.type as ProfileRelease["type"],
    releaseDate: r.releaseDate,
    year: new Date(r.releaseDate).getFullYear().toString(),
    description: r.description ?? "",
    spotifyUrl: r.streamingLinks.spotify ?? "",
    coverArt: r.coverArt ?? "",
    tracks: r.tracks.map(t => ({ number: t.number, title: t.title, duration: t.duration })),
  })),
  shows: dataShows.map(s => ({
    date: s.date, venue: s.venue, city: s.city, state: s.state,
    ticketUrl: s.ticketUrl, status: s.status, notes: s.notes,
  })),
  bookingEmail: artist.bookingEmail ?? "",
  bookingContact: artist.bookingContact,
  instagram: artist.socialLinks.instagram ?? "",
  spotify: artist.streamingLinks.spotify ?? "",
  appleMusic: artist.streamingLinks.appleMusic ?? "",
  youtube: artist.socialLinks.youtube ?? "",
  facebook: artist.socialLinks.facebook ?? "",
  tiktok: artist.socialLinks.tiktok ?? "",
  heroImage: "/ryan-chrys-logo.jpg",
  coverImage: "/ryan-chrys-cover.jpg",
  albumArt: "",
  colorMode: "dark",
  appleMusicArtistId: "1211414535",
  merchUrl: artist.merchUrl ?? "",
  pressQuotes: artist.pressQuotes?.map(q => ({ quote: q.quote, source: q.source, year: q.year })),
  awards: artist.awards,
  links: (artist.allLinks ?? []).map(l => ({ label: l.label, url: l.url, category: l.category })),
  gear: dataGear.map(m => ({ member: m.member, role: m.role, gear: m.gear })),
  venues: buildVenuesFromShows(dataShows),
  videos: dataVideos.map(v => ({ title: v.title, youtubeId: v.youtubeId, date: "" })),
  showHistory: dataShowHistory.map(s => ({
    date: s.date, venue: s.venue, city: s.city, state: s.state,
    status: s.status, notes: s.notes ?? "",
    capacity: (s as any).capacity, attendance: (s as any).attendance,
    setlist: (s as any).setlist ?? [], openers: (s as any).openers ?? [],
    recordingAvailable: false,
  })),
  milestones: artist.milestones ?? [],
  influences: artist.influences ?? [],
  collaborators: artist.collaborators ?? [],
  pressArchive: artist.pressArchive ?? [],
  radioPlay: artist.radioPlay ?? [],
  syncPlacements: artist.syncPlacements ?? [],
  drawByMarket: artist.drawByMarket ?? [],
  touringRadius: artist.touringRadius ?? "",
  riderNotes: artist.riderNotes ?? "",
  syncProfile: {
    pro: "BMI",
    publisher: "Rough Cuts Music Publishing",
    contactEmail: artist.bookingEmail ?? "",
    stemFilesAvailable: true,
    instrumentalVersionsAvailable: true,
    tracks: [
      { title: "Blame It On the Road", albumTitle: "Blame It On the Road", bpm: 118, musicalKey: "G Major", duration: "3:48", mood: ["Nostalgic", "Gritty", "Energetic"], theme: ["Road Trip", "Small Town", "Freedom"], instrumentation: ["Electric Guitar", "Fiddle", "Drums", "Bass", "Steel Guitar"], explicit: false, hasInstrumental: true, hasStems: true, licensingStatus: "available", notes: "Strong opener energy. Works well for travel, truck, or lifestyle spots." },
      { title: "Killer", albumTitle: "Shovel Full of Coal", bpm: 132, musicalKey: "E Minor", duration: "3:15", mood: ["Aggressive", "Dark", "Rebellious"], theme: ["Outlaw", "Confrontation", "Grit"], instrumentation: ["Electric Guitar", "Drums", "Bass", "Harmonica"], explicit: false, hasInstrumental: true, hasStems: true, licensingStatus: "available", notes: "High-energy outlaw feel. Fight scenes, action sequences, western trailers." },
      { title: "Western Abyss", albumTitle: "Western Abyss", bpm: 88, musicalKey: "D Minor", duration: "4:12", mood: ["Melancholic", "Cinematic", "Haunting"], theme: ["Loss", "Isolation", "Wide Open Spaces"], instrumentation: ["Acoustic Guitar", "Lap Steel", "Bass", "Sparse Drums"], explicit: false, hasInstrumental: true, hasStems: true, licensingStatus: "available", notes: "Strong cinematic potential. End-of-film scenes, wide landscape shots." },
      { title: "Hard Luck Story", albumTitle: "Blame It On the Road", bpm: 104, musicalKey: "A Major", duration: "3:33", mood: ["Bittersweet", "Hopeful", "Warm"], theme: ["Perseverance", "Blue Collar", "Comeback"], instrumentation: ["Acoustic Guitar", "Fiddle", "Piano", "Bass", "Drums"], explicit: false, hasInstrumental: false, hasStems: true, licensingStatus: "available" },
      { title: "Colorado Heartbreak", albumTitle: "Blame It On the Road", bpm: 76, musicalKey: "C Major", duration: "4:05", mood: ["Emotional", "Longing", "Quiet"], theme: ["Heartbreak", "Home", "Mountains"], instrumentation: ["Acoustic Guitar", "Pedal Steel", "Piano", "Strings"], explicit: false, hasInstrumental: true, hasStems: true, licensingStatus: "available", notes: "Ballad. Ideal for emotional TV drama moments, montages." },
      { title: "Outlaw In Us All", albumTitle: "Blame It On the Road", bpm: 124, musicalKey: "G Major", duration: "3:22", mood: ["Defiant", "Celebratory", "Bold"], theme: ["Freedom", "Identity", "Community"], instrumentation: ["Electric Guitar", "Fiddle", "Drums", "Bass", "Mandolin"], explicit: false, hasInstrumental: false, hasStems: true, licensingStatus: "available" },
      { title: "Shotgun", albumTitle: "Single", bpm: 128, musicalKey: "E Major", duration: "3:22", mood: ["Driving", "Energetic", "Fun"], theme: ["Road Trip", "Summer", "Spontaneity"], instrumentation: ["Electric Guitar", "Drums", "Bass"], explicit: false, hasInstrumental: true, hasStems: false, licensingStatus: "available", notes: "Uptempo single. Vehicle spots, sports, high-energy montage." },
      { title: "Wasted", albumTitle: "Single", bpm: 94, musicalKey: "B Minor", duration: "3:45", mood: ["Melancholic", "Reflective", "Raw"], theme: ["Regret", "Late Night", "Relationships"], instrumentation: ["Acoustic Guitar", "Pedal Steel", "Bass"], explicit: false, hasInstrumental: false, hasStems: false, licensingStatus: "available" },
    ],
  },
};

function buildVenuesFromShows(shows: typeof dataShows): VenueRecord[] {
  const map = new Map<string, VenueRecord>();
  shows.filter(s => s.status === "past").forEach(s => {
    const key = `${s.venue}|${s.city}|${s.state}`;
    if (!map.has(key)) {
      map.set(key, {
        id: key.replace(/[^a-z0-9]/gi, "-").toLowerCase(),
        name: s.venue, city: s.city, state: s.state ?? "",
        capacity: s.capacity,
        relationship: "played",
        history: [],
      });
    }
    map.get(key)!.history.push({
      date: s.date,
      draw: s.attendance,
      notes: s.notes,
    });
  });
  return Array.from(map.values()).sort((a, b) => {
    const aLast = a.history.at(-1)?.date ?? "";
    const bLast = b.history.at(-1)?.date ?? "";
    return bLast.localeCompare(aLast);
  });
}

export function saveProfile(profile: ProfileData): void {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {}
}

export function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEMO_PROFILE;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved) as ProfileData;
    const intake = localStorage.getItem("bandstack-intake-v2");
    if (intake) {
      const d = JSON.parse(intake) as { name?: string; contactEmail?: string; genre?: string | string[] };
      const genre = Array.isArray(d.genre) ? d.genre[0] : d.genre || "";
      return { ...DEMO_PROFILE, name: d.name || DEMO_PROFILE.name, contactEmail: d.contactEmail || "", genre };
    }
  } catch {}
  return DEMO_PROFILE;
}
