export interface VenueSeed {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: string;
  venueType: string;
  website: string;
  phone: string;
}

export const VENUE_SEED: VenueSeed[] = [
  // ── DENVER ──
  { id: "red-rocks-amphitheatre", name: "Red Rocks Amphitheatre", address: "18300 W Alameda Pkwy", city: "Morrison", state: "CO", capacity: "9,525", venueType: "Amphitheatre", website: "redrocksonline.com", phone: "(720) 865-2494" },
  { id: "ball-arena", name: "Ball Arena", address: "1000 Chopper Cir", city: "Denver", state: "CO", capacity: "19,520", venueType: "Arena", website: "ballarena.com", phone: "(303) 405-1100" },
  { id: "fiddlers-green", name: "Fiddler's Green Amphitheatre", address: "6350 Greenwood Plaza Blvd", city: "Greenwood Village", state: "CO", capacity: "18,000", venueType: "Amphitheatre", website: "fiddlersgreenamphitheatre.com", phone: "(303) 220-7000" },
  { id: "mission-ballroom", name: "Mission Ballroom", address: "4242 Wynkoop St", city: "Denver", state: "CO", capacity: "3,950", venueType: "Ballroom", website: "missionballroom.com", phone: "(720) 990-4699" },
  { id: "ogden-theatre", name: "Ogden Theatre", address: "935 E Colfax Ave", city: "Denver", state: "CO", capacity: "1,600", venueType: "Theatre", website: "ogdentheatre.com", phone: "(303) 832-1874" },
  { id: "bluebird-theater", name: "Bluebird Theater", address: "3317 E Colfax Ave", city: "Denver", state: "CO", capacity: "550", venueType: "Club", website: "bluebirdtheater.net", phone: "(303) 377-1666" },
  { id: "fillmore-auditorium", name: "Fillmore Auditorium", address: "1510 Clarkson St", city: "Denver", state: "CO", capacity: "3,500", venueType: "Auditorium", website: "fillmoreauditorium.org", phone: "(303) 837-0360" },
  { id: "summit-music-hall", name: "Summit Music Hall", address: "1902 Blake St", city: "Denver", state: "CO", capacity: "1,000", venueType: "Club", website: "summitdenver.com", phone: "(303) 487-0111" },
  { id: "gothic-theatre", name: "Gothic Theatre", address: "3263 S Broadway", city: "Englewood", state: "CO", capacity: "1,100", venueType: "Theatre", website: "gothictheatre.com", phone: "(303) 788-0984" },
  { id: "grizzly-rose", name: "Grizzly Rose", address: "5450 N Valley Hwy", city: "Denver", state: "CO", capacity: "1,000", venueType: "Club", website: "grizzlyrose.com", phone: "(303) 295-1330" },
  { id: "larimer-lounge", name: "Larimer Lounge", address: "2721 Larimer St", city: "Denver", state: "CO", capacity: "300", venueType: "Bar/Club", website: "larimerlounge.com", phone: "(303) 291-1007" },
  { id: "marquis-theater", name: "Marquis Theater", address: "2009 Larimer St", city: "Denver", state: "CO", capacity: "400", venueType: "Club", website: "marquisdenver.com", phone: "(720) 578-7653" },
  { id: "lost-lake-lounge", name: "Lost Lake Lounge", address: "3602 E Colfax Ave", city: "Denver", state: "CO", capacity: "200", venueType: "Bar/Club", website: "lostlakelounge.com", phone: "(303) 293-0106" },
  { id: "cervantes-masterpiece", name: "Cervantes' Masterpiece Ballroom", address: "2637 Welton St", city: "Denver", state: "CO", capacity: "900", venueType: "Ballroom", website: "cervantesdenver.com", phone: "(303) 297-1772" },
  { id: "cervantes-other-side", name: "Cervantes' Other Side", address: "2637 Welton St", city: "Denver", state: "CO", capacity: "300", venueType: "Club", website: "cervantesdenver.com", phone: "(303) 297-1772" },
  { id: "globe-hall", name: "Globe Hall", address: "4483 Logan St", city: "Denver", state: "CO", capacity: "250", venueType: "Bar/Club", website: "globehall.com", phone: "(720) 668-7706" },
  { id: "lion-s-lair", name: "Lion's Lair", address: "2022 E Colfax Ave", city: "Denver", state: "CO", capacity: "150", venueType: "Bar", website: "lionslair.com", phone: "(303) 320-9200" },
  { id: "hi-dive", name: "Hi-Dive", address: "7 S Broadway", city: "Denver", state: "CO", capacity: "300", venueType: "Bar/Club", website: "hi-dive.com", phone: "(720) 570-4500" },
  { id: "meow-wolf-denver", name: "Meow Wolf Denver — Convergence Station", address: "1338 1st St", city: "Denver", state: "CO", capacity: "2,000", venueType: "Venue/Experience", website: "meowwolf.com", phone: "(833) 636-9269" },
  { id: "red-rocks-trading-post", name: "Mile High Stadium (Empower Field)", address: "1701 Bryant St", city: "Denver", state: "CO", capacity: "76,125", venueType: "Stadium", website: "empowerfieldatmilehigh.com", phone: "(720) 258-3333" },
  { id: "levitt-pavilion", name: "Levitt Pavilion Denver", address: "1380 W Florida Ave", city: "Denver", state: "CO", capacity: "7,500", venueType: "Outdoor Amphitheatre", website: "levittdenver.org", phone: "(303) 953-3072" },
  { id: "streets-of-london", name: "Streets of London Pub", address: "1501 17th St", city: "Denver", state: "CO", capacity: "200", venueType: "Pub", website: "", phone: "(303) 291-0666" },
  { id: "dazzle-jazz", name: "Dazzle Jazz", address: "1512 Curtis St", city: "Denver", state: "CO", capacity: "150", venueType: "Jazz Club", website: "dazzlejazz.com", phone: "(303) 839-5100" },
  { id: "el-chapultepec", name: "El Chapultepec", address: "1962 Market St", city: "Denver", state: "CO", capacity: "100", venueType: "Jazz Bar", website: "", phone: "(303) 295-9126" },

  // ── BOULDER ──
  { id: "boulder-theater", name: "Boulder Theater", address: "2032 14th St", city: "Boulder", state: "CO", capacity: "800", venueType: "Theatre", website: "bouldertheater.com", phone: "(303) 786-7030" },
  { id: "fox-theater-boulder", name: "Fox Theatre", address: "1135 13th St", city: "Boulder", state: "CO", capacity: "625", venueType: "Theatre", website: "foxtheatre.com", phone: "(303) 447-0095" },
  { id: "chautauqua-auditorium", name: "Chautauqua Auditorium", address: "900 Baseline Rd", city: "Boulder", state: "CO", capacity: "1,350", venueType: "Auditorium", website: "chautauqua.com", phone: "(303) 442-3282" },
  { id: "macky-auditorium", name: "Macky Auditorium", address: "1595 Pleasant St", city: "Boulder", state: "CO", capacity: "2,047", venueType: "Auditorium", website: "colorado.edu/macky", phone: "(303) 492-8008" },
  { id: "arista-boulder", name: "Arista Boulder", address: "2785 Canyon Blvd", city: "Boulder", state: "CO", capacity: "300", venueType: "Club", website: "", phone: "" },
  { id: "catacombs-bar", name: "Catacombs Bar", address: "2115 13th St", city: "Boulder", state: "CO", capacity: "200", venueType: "Bar", website: "", phone: "(303) 443-0486" },

  // ── FORT COLLINS ──
  { id: "aggie-theatre", name: "Aggie Theatre", address: "204 S College Ave", city: "Fort Collins", state: "CO", capacity: "650", venueType: "Theatre", website: "aggietheatre.com", phone: "(970) 482-8300" },
  { id: "washington-s-fort-collins", name: "Washington's", address: "132 Laporte Ave", city: "Fort Collins", state: "CO", capacity: "500", venueType: "Club", website: "washingtons.com", phone: "(970) 484-1922" },
  { id: "the-surfside-7", name: "Surfside 7", address: "626 S Mason St", city: "Fort Collins", state: "CO", capacity: "200", venueType: "Bar/Club", website: "", phone: "(970) 484-5757" },
  { id: "hemp-hemp-hooray", name: "Hodi's Half Note", address: "167 N College Ave", city: "Fort Collins", state: "CO", capacity: "300", venueType: "Bar/Club", website: "", phone: "(970) 472-8454" },
  { id: "mishawaka-amphitheatre", name: "Mishawaka Amphitheatre", address: "13714 Poudre Canyon Rd", city: "Bellvue", state: "CO", capacity: "1,000", venueType: "Amphitheatre", website: "mishawaka.com", phone: "(970) 482-4420" },

  // ── COLORADO SPRINGS ──
  { id: "pikes-peak-center", name: "Pikes Peak Center", address: "190 S Cascade Ave", city: "Colorado Springs", state: "CO", capacity: "2,000", venueType: "Performing Arts", website: "pikespeakcenter.com", phone: "(719) 477-2100" },
  { id: "weidner-field", name: "Weidner Field", address: "1 Stadium Way", city: "Colorado Springs", state: "CO", capacity: "8,000", venueType: "Stadium", website: "", phone: "" },
  { id: "the-black-sheep", name: "The Black Sheep", address: "2106 E Platte Ave", city: "Colorado Springs", state: "CO", capacity: "400", venueType: "Club", website: "theblacksheeprocks.com", phone: "(719) 227-7625" },
  { id: "lulu-s-fountain", name: "Lulu's Fountain", address: "12 S Tejon St", city: "Colorado Springs", state: "CO", capacity: "200", venueType: "Bar", website: "", phone: "(719) 632-8600" },

  // ── ASPEN / SNOWMASS ──
  { id: "belly-up-aspen", name: "Belly Up Aspen", address: "450 S Galena St", city: "Aspen", state: "CO", capacity: "450", venueType: "Club", website: "bellyupaspen.com", phone: "(970) 544-9800" },
  { id: "harris-concert-hall", name: "Harris Concert Hall", address: "2 Music School Rd", city: "Aspen", state: "CO", capacity: "500", venueType: "Concert Hall", website: "aspenmusicfestival.com", phone: "(970) 925-9042" },
  { id: "benedict-music-tent", name: "Benedict Music Tent", address: "980 N 3rd St", city: "Aspen", state: "CO", capacity: "2,050", venueType: "Tent/Amphitheatre", website: "aspenmusicfestival.com", phone: "(970) 925-9042" },

  // ── STEAMBOAT SPRINGS ──
  { id: "10-mile-music-hall", name: "10 Mile Music Hall", address: "710 Main St", city: "Frisco", state: "CO", capacity: "400", venueType: "Club", website: "10milemh.com", phone: "(970) 668-0709" },
  { id: "schmiggitys", name: "Schmiggity's Live Music", address: "821 Lincoln Ave", city: "Steamboat Springs", state: "CO", capacity: "300", venueType: "Bar/Club", website: "", phone: "(970) 871-9000" },
  { id: "strings-music-pavilion", name: "Strings Music Pavilion", address: "900 Strings Rd", city: "Steamboat Springs", state: "CO", capacity: "1,500", venueType: "Pavilion", website: "stringsmusicfestival.com", phone: "(970) 879-5056" },

  // ── TELLURIDE ──
  { id: "telluride-town-park", name: "Telluride Town Park", address: "500 E Colorado Ave", city: "Telluride", state: "CO", capacity: "5,000", venueType: "Outdoor Festival Grounds", website: "telluride.com", phone: "" },
  { id: "sheridan-opera-house", name: "Sheridan Opera House", address: "110 N Oak St", city: "Telluride", state: "CO", capacity: "240", venueType: "Opera House", website: "sheridanoperahouse.com", phone: "(970) 728-6363" },

  // ── PUEBLO ──
  { id: "nature-and-raptor-center", name: "Historic Arkansas Riverwalk", address: "101 S Union Ave", city: "Pueblo", state: "CO", capacity: "2,000", venueType: "Outdoor Venue", website: "puebloriverwalk.org", phone: "" },
  { id: "raw-hide-steakhouse", name: "Rawhide Steakhouse & Saloon", address: "300 N Elizabeth St", city: "Pueblo", state: "CO", capacity: "300", venueType: "Bar/Club", website: "", phone: "(719) 544-8881" },

  // ── GLENWOOD SPRINGS ──
  { id: "glenwood-caverns", name: "Glenwood Caverns Adventure Park", address: "51000 Two Rivers Plaza Rd", city: "Glenwood Springs", state: "CO", capacity: "1,000", venueType: "Outdoor Venue", website: "glenwoodcaverns.com", phone: "(800) 530-1635" },

  // ── VAIL ──
  { id: "gerald-r-ford-amphitheater", name: "Gerald R. Ford Amphitheater", address: "530 S Frontage Rd E", city: "Vail", state: "CO", capacity: "4,200", venueType: "Amphitheatre", website: "vvf.org", phone: "(970) 827-5700" },
];
