"use client";
import BandPage from "@/components/band/BandPage";
import type { ProfileData } from "@/lib/bandProfile";

const DEFAULT_PROFILE: ProfileData = {
  name: "AS WE RISE",
  genre: "Metal",
  tagline: "Colorado metal. Dedicated to forward progress for all humankind.",
  origin: "Colorado",
  founded: "2021",
  bio: "AS WE RISE is a Colorado metal band dedicated to forward progress for all humankind. Formed in 2021, blending heavy modern metal with a mission-driven message.",
  members: [],
  releases: [
    { title: "Delimitwhore", type: "single", year: "2024", description: "Latest single — out now on all platforms.", spotifyUrl: "https://open.spotify.com/artist/3hrYxjghoWnBcGXEOMxFYu", coverArt: "", tracks: [{ number: 1, title: "Delimitwhore" }] },
  ],
  shows: [],
  contactEmail: "",
  bookingEmail: "",
  instagram: "https://instagram.com/asweriseofficial",
  spotify: "https://open.spotify.com/artist/3hrYxjghoWnBcGXEOMxFYu",
  appleMusic: "https://music.apple.com/us/artist/as-we-rise/1633828507",
  youtube: "https://youtube.com/channel",
  facebook: "https://facebook.com/awrofficial",
  tiktok: "https://tiktok.com/@asweriseofficial",
  heroImage: "https://static.wixstatic.com/media/200885_3f1b725a2e584c36b4950df5211ab1f3%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/200885_3f1b725a2e584c36b4950df5211ab1f3%7Emv2.jpg",
  coverImage: "https://static.wixstatic.com/media/200885_3f1b725a2e584c36b4950df5211ab1f3%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/200885_3f1b725a2e584c36b4950df5211ab1f3%7Emv2.jpg",
  albumArt: "",
  colorMode: "dark",
  appleMusicArtistId: "1633828507",
  youtubeChannelId: "UC5jgVhjLdj2Kd-Ty6BLkFLw",
  videos: [
    { title: "Delimitwhore (Official Music Video)", youtubeId: "5YVg8vX8Ew0", date: "2024" },
    { title: "Head Underwater (Official Music Video)", youtubeId: "_b2tKW2x_JU", date: "2023" },
  ],
  links: [
    { category: "Streaming", label: "Spotify",          url: "https://open.spotify.com/artist/3hrYxjghoWnBcGXEOMxFYu" },
    { category: "Streaming", label: "Apple Music",      url: "https://music.apple.com/us/artist/as-we-rise/1633828507" },
    { category: "Streaming", label: "Amazon Music",     url: "" },
    { category: "Streaming", label: "YouTube Music",    url: "" },
    { category: "Streaming", label: "Pandora",          url: "" },
    { category: "Streaming", label: "iHeart Radio",     url: "" },
    { category: "Streaming", label: "SoundCloud",       url: "" },
    { category: "Video",     label: "YouTube",          url: "https://youtube.com/channel" },
    { category: "Video",     label: "Vevo",             url: "" },
    { category: "Social",    label: "Instagram",        url: "https://instagram.com/asweriseofficial" },
    { category: "Social",    label: "Facebook",         url: "https://facebook.com/awrofficial" },
    { category: "Social",    label: "TikTok",           url: "https://tiktok.com/@asweriseofficial" },
    { category: "Social",    label: "X / Twitter",      url: "" },
    { category: "Purchase",  label: "Official Store",   url: "" },
    { category: "Purchase",  label: "iTunes",           url: "" },
    { category: "Discovery", label: "Bandsintown",      url: "" },
    { category: "Discovery", label: "Songkick",         url: "" },
    { category: "Discovery", label: "AllMusic",         url: "" },
    { category: "Discovery", label: "Last.fm",          url: "" },
    { category: "Official",  label: "Official Website", url: "https://www.asweriseofficial.com" },
    { category: "Official",  label: "Newsletter Signup",url: "" },
    { category: "Official",  label: "Booking",          url: "" },
    { category: "Official",  label: "Linktree",         url: "https://linktr.ee/aswerise" },
  ],
};

export default function AsWeRisePage() {
  return (
    <BandPage
      profileKey="bandstack-as-we-rise-v1"
      defaultProfile={DEFAULT_PROFILE}
      stagePlotHref="/bandstack/as-we-rise/stage-plot"
    />
  );
}
