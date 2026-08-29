"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Track, Release } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────

export type PlayMode = "audio" | "disabled";

export interface NowPlaying {
  track:      Track;
  release:    Release;
  trackIndex: number;
}

interface AudioContextValue {
  nowPlaying:  NowPlaying | null;
  isPlaying:   boolean;
  progress:    number;
  duration:    number;
  mode:        PlayMode;
  playTrack:   (track: Track, release: Release, index: number) => void;
  togglePlay:  () => void;
  nextTrack:   () => void;
  prevTrack:   () => void;
  seek:        (time: number) => void;
  close:       () => void;
}

// ─── Context ──────────────────────────────────────────────────────

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

// ─── Helpers ─────────────────────────────────────────────────────

export function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function resolveMode(track: Track): PlayMode {
  if (track.audioSrc) return "audio";
  return "disabled";
}

// ─── Provider ─────────────────────────────────────────────────────

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef               = useRef<HTMLAudioElement | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [duration,   setDuration]   = useState(0);
  const [mode,       setMode]       = useState<PlayMode>("disabled");

  // ── Wire audio element events once on mount ──────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime     = () => setProgress(el.currentTime);
    const onDuration = () => setDuration(el.duration || 0);
    const onEnd      = () => setIsPlaying(false);
    el.addEventListener("timeupdate",    onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("ended",         onEnd);
    return () => {
      el.removeEventListener("timeupdate",    onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("ended",         onEnd);
    };
  }, []);

  // ── Load + play when nowPlaying changes ──────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !nowPlaying || mode !== "audio") return;
    el.src = nowPlaying.track.audioSrc ?? "";
    el.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setProgress(0);
  }, [nowPlaying, mode]);

  // ── Actions ──────────────────────────────────────────────────

  const playTrack = useCallback((track: Track, release: Release, index: number) => {
    const resolved = resolveMode(track);
    setMode(resolved);
    if (resolved === "disabled") return;
    setNowPlaying({ track, release, trackIndex: index });
  }, []);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) { el.play(); setIsPlaying(true); }
    else           { el.pause(); setIsPlaying(false); }
  }, []);

  const seek = useCallback((time: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = time;
    setProgress(time);
  }, []);

  const nextTrack = useCallback(() => {
    if (!nowPlaying) return;
    const tracks = nowPlaying.release.tracks;
    const next = nowPlaying.trackIndex + 1;
    if (next < tracks.length) {
      const t = tracks[next];
      setMode(resolveMode(t));
      setNowPlaying({ track: t, release: nowPlaying.release, trackIndex: next });
    }
  }, [nowPlaying]);

  const prevTrack = useCallback(() => {
    if (!nowPlaying) return;
    // If >3s in, restart current track; otherwise go back
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      setProgress(0);
      return;
    }
    const prev = nowPlaying.trackIndex - 1;
    if (prev >= 0) {
      const t = nowPlaying.release.tracks[prev];
      setMode(resolveMode(t));
      setNowPlaying({ track: t, release: nowPlaying.release, trackIndex: prev });
    }
  }, [nowPlaying]);

  const close = useCallback(() => {
    audioRef.current?.pause();
    setNowPlaying(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, []);

  return (
    <AudioCtx.Provider value={{
      nowPlaying, isPlaying, progress, duration, mode,
      playTrack, togglePlay, nextTrack, prevTrack, seek, close,
    }}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} />
    </AudioCtx.Provider>
  );
}
