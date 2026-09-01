// ─────────────────────────────────────────────
//  BandStack · Venue Data
//  Colorado seed — Phase 3
// ─────────────────────────────────────────────

export interface VenueBackline {
  drumKit: boolean;
  drumKitNotes?: string;
  bassAmp: boolean;
  guitarAmp: boolean;
  ampNotes?: string;
  piano: boolean;
  pianoNotes?: string;
  di: number;           // number of DI boxes available
}

export interface VenuePA {
  system?: string;      // e.g. "L-Acoustics Kara"
  mains: boolean;
  monitors: boolean;
  monitorMixes: number; // number of independent monitor mixes
  inEarMonitors: boolean;
  subwoofers: boolean;
}

export interface VenueTech {
  pa: VenuePA;
  backline: VenueBackline;
  stageWidth?: number;    // feet
  stageDepth?: number;    // feet
  stageCeilingHeight?: number; // feet
  loadIn?: string;        // e.g. "Rear alley, double doors"
  powerAmps?: string;     // e.g. "20A circuits available"
  lighting: boolean;
  lightingNotes?: string;
  greenRoom: boolean;
  parkingNotes?: string;
}

export interface Venue {
  slug: string;
  name: string;
  city: string;
  state: string;
  neighborhood?: string;
  capacity: number;
  standing?: number;      // standing-only capacity if different
  genres: string[];       // genre affinities
  website?: string;
  bookingEmail?: string;
  bookingContact?: string;
  phone?: string;
  address?: string;
  description: string;
  tech: VenueTech;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  imageUrl?: string;
  yearOpened?: number;
  notes?: string;         // general notes visible on profile
}

// ─────────────────────────────────────────────
//  COLORADO VENUES
// ─────────────────────────────────────────────

export const venues: Venue[] = [
  {
    slug: "grizzly-rose",
    name: "Grizzly Rose",
    city: "Denver",
    state: "CO",
    neighborhood: "Globeville",
    capacity: 1000,
    standing: 1200,
    genres: ["country", "outlaw country", "country rock", "americana", "rockabilly"],
    website: "https://grizzlyrose.com",
    bookingEmail: "booking@grizzlyrose.com",
    address: "5450 N Valley Hwy, Denver, CO 80216",
    yearOpened: 1990,
    description: "Denver's premier country music venue. A 1,000-capacity dance hall and concert venue that has hosted every major country act touring through Colorado for over three decades. Known for its massive dance floor, mechanical bull, and the best country sound system in the state.",
    tech: {
      pa: {
        system: "JBL VTX",
        mains: true,
        monitors: true,
        monitorMixes: 6,
        inEarMonitors: false,
        subwoofers: true,
      },
      backline: {
        drumKit: true,
        drumKitNotes: "Pearl Masters house kit — cymbals not included",
        bassAmp: true,
        guitarAmp: true,
        ampNotes: "Fender Twin and Ampeg SVT available",
        piano: false,
        di: 8,
      },
      stageWidth: 40,
      stageDepth: 28,
      stageCeilingHeight: 24,
      loadIn: "Stage-right side door off parking lot",
      lighting: true,
      lightingNotes: "Full moving-head rig, house LD available on request",
      greenRoom: true,
      parkingNotes: "Large free lot, bus/trailer friendly",
    },
    socialLinks: {
      instagram: "https://instagram.com/grizzlyrose",
      facebook: "https://facebook.com/grizzlyrose",
    },
    notes: "21+ after 8pm. Advance load-in required by 5pm for 8pm shows.",
  },

  {
    slug: "bluebird-theater",
    name: "Bluebird Theater",
    city: "Denver",
    state: "CO",
    neighborhood: "Capitol Hill",
    capacity: 550,
    genres: ["indie", "alternative", "folk", "americana", "rock", "singer-songwriter"],
    website: "https://bluebirdtheater.net",
    bookingEmail: "booking@bluebirdtheater.net",
    address: "3317 E Colfax Ave, Denver, CO 80206",
    yearOpened: 1913,
    description: "A Denver institution since 1913. The Bluebird is an intimate 550-cap theater on Colfax with some of the best acoustics in the city. Originally a movie house, now one of the most beloved mid-size venues in Colorado — known for sight lines, sound, and a loyal audience.",
    tech: {
      pa: {
        system: "d&b audiotechnik",
        mains: true,
        monitors: true,
        monitorMixes: 8,
        inEarMonitors: true,
        subwoofers: true,
      },
      backline: {
        drumKit: false,
        bassAmp: false,
        guitarAmp: false,
        piano: false,
        di: 12,
      },
      stageWidth: 30,
      stageDepth: 20,
      stageCeilingHeight: 18,
      loadIn: "Rear alley off Elizabeth St",
      lighting: true,
      lightingNotes: "Full theatrical rig, moving heads, house LD",
      greenRoom: true,
      parkingNotes: "Street parking on Colfax. No dedicated lot.",
    },
    socialLinks: {
      instagram: "https://instagram.com/bluebirdtheater",
      facebook: "https://facebook.com/bluebirdtheaterdenver",
    },
    notes: "No backline provided — artists must supply all instruments and amps. IEM system available for rental.",
  },

  {
    slug: "ogden-theatre",
    name: "Ogden Theatre",
    city: "Denver",
    state: "CO",
    neighborhood: "Capitol Hill",
    capacity: 1600,
    genres: ["rock", "alternative", "indie", "electronic", "metal", "hip-hop"],
    website: "https://ogdentheatre.com",
    bookingEmail: "booking@ogdentheatre.com",
    address: "935 E Colfax Ave, Denver, CO 80218",
    yearOpened: 1917,
    description: "Denver's iconic 1,600-cap theater on Colfax. One of the city's most storied rooms — a former vaudeville house that now hosts nationally touring acts across rock, alternative, and electronic genres. Standing-room floor with a balcony for those who want to sit.",
    tech: {
      pa: {
        system: "L-Acoustics Kara",
        mains: true,
        monitors: true,
        monitorMixes: 8,
        inEarMonitors: true,
        subwoofers: true,
      },
      backline: {
        drumKit: false,
        bassAmp: false,
        guitarAmp: false,
        piano: false,
        di: 16,
      },
      stageWidth: 45,
      stageDepth: 30,
      stageCeilingHeight: 30,
      loadIn: "Stage-left alley, dock height",
      lighting: true,
      lightingNotes: "Full touring-grade rig with followspot",
      greenRoom: true,
      parkingNotes: "Street parking. Tour bus/semi drop-off via alley.",
    },
    socialLinks: {
      instagram: "https://instagram.com/ogdentheatre",
      facebook: "https://facebook.com/ogdentheatre",
    },
    notes: "Full production rider required 30 days in advance. No backline — artists provide all.",
  },

  {
    slug: "gothic-theatre",
    name: "Gothic Theatre",
    city: "Englewood",
    state: "CO",
    neighborhood: "South Broadway",
    capacity: 1000,
    genres: ["rock", "alternative", "punk", "metal", "indie", "americana"],
    website: "https://gothictheatre.com",
    bookingEmail: "booking@gothictheatre.com",
    address: "3263 S Broadway, Englewood, CO 80113",
    yearOpened: 1925,
    description: "A South Broadway landmark with a century of history. The Gothic is a 1,000-cap room with a reputation for excellent sound and a gritty, no-frills atmosphere that touring bands love. The long narrow floor gives the room an intimate feel despite its capacity.",
    tech: {
      pa: {
        system: "Meyer Sound",
        mains: true,
        monitors: true,
        monitorMixes: 6,
        inEarMonitors: false,
        subwoofers: true,
      },
      backline: {
        drumKit: false,
        bassAmp: true,
        guitarAmp: true,
        ampNotes: "Marshall half-stack and Ampeg SVT-4 Pro available",
        piano: false,
        di: 8,
      },
      stageWidth: 35,
      stageDepth: 22,
      stageCeilingHeight: 20,
      loadIn: "Side door off S Broadway — no alley",
      lighting: true,
      lightingNotes: "Standard club rig, no moving heads",
      greenRoom: true,
      parkingNotes: "Street parking on S Broadway. Limited loading zone.",
    },
    socialLinks: {
      instagram: "https://instagram.com/gothictheatre",
      facebook: "https://facebook.com/gothictheatre",
    },
  },

  {
    slug: "summit-music-hall",
    name: "Summit Music Hall",
    city: "Denver",
    state: "CO",
    neighborhood: "Five Points",
    capacity: 500,
    genres: ["rock", "alternative", "punk", "indie", "electronic", "metal"],
    website: "https://summitmusichangout.com",
    bookingEmail: "booking@summitmusichangout.com",
    address: "1902 Blake St, Denver, CO 80202",
    yearOpened: 2010,
    description: "A 500-cap room in Denver's Five Points neighborhood, steps from downtown and Coors Field. Summit is the go-to mid-size room for rock and alternative acts on the way up — a tight, loud, sweaty room that touring bands consistently cite as one of their favorites in Colorado.",
    tech: {
      pa: {
        mains: true,
        monitors: true,
        monitorMixes: 4,
        inEarMonitors: false,
        subwoofers: true,
      },
      backline: {
        drumKit: true,
        drumKitNotes: "Tama Starclassic house kit",
        bassAmp: true,
        guitarAmp: true,
        ampNotes: "Fender Hot Rod Deville and Ampeg SVT-CL available",
        piano: false,
        di: 6,
      },
      stageWidth: 24,
      stageDepth: 18,
      stageCeilingHeight: 14,
      loadIn: "Front entrance on Blake St — no dedicated load-in door",
      lighting: true,
      lightingNotes: "Basic club wash and par cans",
      greenRoom: true,
      parkingNotes: "Street parking. No dedicated lot.",
    },
    socialLinks: {
      instagram: "https://instagram.com/summitmusichangout",
      facebook: "https://facebook.com/summitmusichangout",
    },
    notes: "Backline available at no charge. First-come basis — confirm availability when booking.",
  },

  {
    slug: "soiled-dove-underground",
    name: "Soiled Dove Underground",
    city: "Denver",
    state: "CO",
    neighborhood: "Glendale",
    capacity: 300,
    genres: ["jazz", "blues", "americana", "soul", "singer-songwriter", "country", "folk"],
    website: "https://soileddoveunderground.com",
    bookingEmail: "booking@soileddoveunderground.com",
    address: "7401 E 1st Ave, Denver, CO 80230",
    yearOpened: 2004,
    description: "Denver's premier intimate venue for jazz, blues, and roots music. A 300-cap supper club atmosphere — tables, full dinner service, and a listening-room culture. The Soiled Dove is where serious musicians play and serious listeners come. Known for impeccable sound in an intimate setting.",
    tech: {
      pa: {
        mains: true,
        monitors: true,
        monitorMixes: 4,
        inEarMonitors: false,
        subwoofers: false,
      },
      backline: {
        drumKit: true,
        drumKitNotes: "Yamaha acoustic kit, brushes preferred",
        bassAmp: true,
        guitarAmp: false,
        piano: true,
        pianoNotes: "Yamaha C3 grand piano — tuned weekly",
        di: 6,
      },
      stageWidth: 20,
      stageDepth: 16,
      stageCeilingHeight: 10,
      loadIn: "Side entrance off parking lot",
      lighting: true,
      lightingNotes: "Theatrical spot lighting, intimate wash — no rock rig",
      greenRoom: true,
      parkingNotes: "Free dedicated lot",
    },
    socialLinks: {
      instagram: "https://instagram.com/soileddove",
      facebook: "https://facebook.com/soileddoveunderground",
    },
    notes: "Dinner service during show. Artists must maintain volume levels appropriate for dining environment. Grand piano is available — tuning request must be made 48hrs in advance.",
  },

  {
    slug: "red-rocks-amphitheatre",
    name: "Red Rocks Amphitheatre",
    city: "Morrison",
    state: "CO",
    capacity: 9525,
    genres: ["rock", "country", "electronic", "americana", "folk", "classical", "hip-hop", "jazz"],
    website: "https://redrocksonline.com",
    bookingEmail: "booking@redrocksonline.com",
    address: "18300 W Alameda Pkwy, Morrison, CO 80465",
    yearOpened: 1941,
    description: "The most famous outdoor venue in the world. Carved into the Rocky Mountain foothills 15 miles from Denver, Red Rocks is a geological amphitheater with 9,525-seat capacity and acoustics that no human-built room can touch. Playing Red Rocks is a career milestone.",
    tech: {
      pa: {
        system: "L-Acoustics K2",
        mains: true,
        monitors: true,
        monitorMixes: 12,
        inEarMonitors: true,
        subwoofers: true,
      },
      backline: {
        drumKit: false,
        bassAmp: false,
        guitarAmp: false,
        piano: false,
        di: 24,
      },
      stageWidth: 80,
      stageDepth: 50,
      stageCeilingHeight: 0,
      loadIn: "Dedicated truck dock, full semi access",
      lighting: true,
      lightingNotes: "Full touring production — artists must supply their own lighting design and crew",
      greenRoom: true,
      parkingNotes: "Structured parking, bus and semi staging area",
    },
    socialLinks: {
      instagram: "https://instagram.com/redrocksamphitheatre",
      facebook: "https://facebook.com/redrocksamphitheatre",
    },
    notes: "Full production contract required. Weather policy in effect — open air venue, shows can be delayed or cancelled. Elevation 6,450 ft.",
  },
];
