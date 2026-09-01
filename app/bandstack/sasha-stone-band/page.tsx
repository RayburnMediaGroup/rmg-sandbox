"use client";
import BandPage from "@/components/band/BandPage";
import type { ProfileData } from "@/lib/bandProfile";

const DEFAULT_PROFILE: ProfileData = {
  name: "Sasha Stone Band",
  genre: "Folk Rock",
  tagline: "Folk | rock from Fort Collins, Colorado.",
  origin: "Fort Collins, CO",
  founded: "2014",
  bio: "The Sasha Stone Band is a folk | rock band from Fort Collins, Colorado, blending acoustic roots with electric energy and an honest storytelling approach.",
  members: [],
  releases: [],
  shows: [],
  contactEmail: "",
  bookingEmail: "",
  instagram: "https://www.instagram.com/thesashastoneband/",
  spotify: "https://open.spotify.com/artist/3uYcinjt3vhD9dtJA5vXnb",
  appleMusic: "",
  facebook: "https://www.facebook.com/thesashastoneband",
  heroImage: "http://static1.squarespace.com/static/58dbe95f9de4bb7a2c75d548/t/67fd917836ea51214f3e605b/1744671096629/0Y2A8943.JPG?format=1500w",
  coverImage: "http://static1.squarespace.com/static/58dbe95f9de4bb7a2c75d548/t/67fd917836ea51214f3e605b/1744671096629/0Y2A8943.JPG?format=1500w",
  albumArt: "",
  colorMode: "dark",
  links: [
    { category: "Streaming", label: "Spotify",          url: "https://open.spotify.com/artist/3uYcinjt3vhD9dtJA5vXnb" },
    { category: "Streaming", label: "Apple Music",      url: "" },
    { category: "Streaming", label: "Amazon Music",     url: "" },
    { category: "Streaming", label: "YouTube Music",    url: "" },
    { category: "Streaming", label: "Pandora",          url: "" },
    { category: "Streaming", label: "iHeart Radio",     url: "" },
    { category: "Streaming", label: "SoundCloud",       url: "" },
    { category: "Video",     label: "YouTube",          url: "" },
    { category: "Video",     label: "Vevo",             url: "" },
    { category: "Social",    label: "Instagram",        url: "https://www.instagram.com/thesashastoneband/" },
    { category: "Social",    label: "Facebook",         url: "https://www.facebook.com/thesashastoneband" },
    { category: "Social",    label: "TikTok",           url: "" },
    { category: "Social",    label: "X / Twitter",      url: "" },
    { category: "Purchase",  label: "Official Store",   url: "" },
    { category: "Purchase",  label: "iTunes",           url: "" },
    { category: "Discovery", label: "Bandsintown",      url: "" },
    { category: "Discovery", label: "Songkick",         url: "" },
    { category: "Discovery", label: "AllMusic",         url: "" },
    { category: "Discovery", label: "Last.fm",          url: "" },
    { category: "Official",  label: "Official Website", url: "https://www.sashastoneband.com" },
    { category: "Official",  label: "Newsletter Signup",url: "" },
    { category: "Official",  label: "Booking",          url: "" },
  ],
};

export default function SashaStoneBandPage() {
  return (
    <BandPage
      profileKey="bandstack-sasha-stone-band-v1"
      defaultProfile={DEFAULT_PROFILE}
      stagePlotHref="/bandstack/sasha-stone-band/stage-plot"
    />
  );
}
