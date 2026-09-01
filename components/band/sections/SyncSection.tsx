"use client";

import { useState } from "react";
import type { ProfileData, SyncTrack, SyncLicensingStatus } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";

interface Props { profile: ProfileData; tokens: TokenSet; isArtist?: boolean; onUpdate?: (u: Partial<ProfileData>) => void; }

const STATUS_COLOR: Record<SyncLicensingStatus, string> = {
  available: "#5aab72", partial: "#d4893a", unavailable: "#d95c5c",
};
const STATUS_LABEL: Record<SyncLicensingStatus, string> = {
  available: "Available", partial: "Partial", unavailable: "Unavailable",
};

const ALL_MOODS = ["Nostalgic","Gritty","Energetic","Aggressive","Dark","Rebellious","Melancholic","Cinematic","Haunting","Bittersweet","Hopeful","Warm","Emotional","Longing","Quiet","Defiant","Celebratory","Bold","Driving","Fun","Reflective","Raw"];
const ALL_THEMES = ["Road Trip","Small Town","Freedom","Outlaw","Confrontation","Grit","Loss","Isolation","Wide Open Spaces","Perseverance","Blue Collar","Comeback","Heartbreak","Home","Mountains","Identity","Community","Summer","Spontaneity","Regret","Late Night","Relationships"];

function TagChip({ label, color, onRemove }: { label: string; color: string; onRemove?: () => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.62rem", fontFamily: "Inter, sans-serif", color, border: `1px solid ${color}44`, borderRadius: 3, padding: "2px 7px", background: `${color}0d` }}>
      {label}
      {onRemove && <button onClick={onRemove} style={{ background: "none", border: "none", color, cursor: "pointer", fontSize: "0.55rem", padding: 0, lineHeight: 1 }}>×</button>}
    </span>
  );
}

export default function SyncSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const body: React.CSSProperties = { ...T, fontSize: "0.82rem", color: tokens.muted, fontWeight: 300 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const surface = isLt ? "#f4f4f4" : "#111";
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: border1, borderRadius: 4, color: tokens.text, padding: "6px 10px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none", width: "100%" };

  const syncProfile = profile.syncProfile;
  const tracks = syncProfile?.tracks ?? [];

  const BLANK_TRACK: SyncTrack = { title: "", albumTitle: "", licensingStatus: "available", mood: [], theme: [], instrumentation: [], explicit: false, hasInstrumental: false, hasStems: false };
  const [addingTrack, setAddingTrack] = useState(false);

  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SyncLicensingStatus | "all">("all");
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<SyncTrack | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const filtered = tracks.filter(t => {
    if (statusFilter !== "all" && t.licensingStatus !== statusFilter) return false;
    if (moodFilter && !t.mood.includes(moodFilter)) return false;
    if (themeFilter && !t.theme.includes(themeFilter)) return false;
    return true;
  });

  const allMoodsInCatalog = [...new Set(tracks.flatMap(t => t.mood))].sort();
  const allThemesInCatalog = [...new Set(tracks.flatMap(t => t.theme))].sort();

  function saveTrack(updated: SyncTrack) {
    const next = tracks.map(t => t.title === updated.title && t.albumTitle === updated.albumTitle ? updated : t);
    const exists = next.some(t => t.title === updated.title && t.albumTitle === updated.albumTitle);
    onUpdate?.({ syncProfile: { ...syncProfile!, tracks: exists ? next : [...next, updated] } });
    setEditingTrack(null);
  }

  function saveSyncProfile(updates: Partial<typeof syncProfile>) {
    onUpdate?.({ syncProfile: { ...syncProfile!, ...updates } });
    setEditingProfile(false);
  }

  function pitchEmail(t: SyncTrack) {
    const subj = encodeURIComponent(`Sync Inquiry — "${t.title}" by ${profile.name}`);
    const body2 = encodeURIComponent(`Hi,\n\nI'm reaching out about licensing "${t.title}" for your project.\n\nTrack details:\n- BPM: ${t.bpm ?? "—"}\n- Key: ${t.musicalKey ?? "—"}\n- Duration: ${t.duration ?? "—"}\n- Instrumental available: ${t.hasInstrumental ? "Yes" : "No"}\n- Stems available: ${t.hasStems ? "Yes" : "No"}\n\nBest,\n${syncProfile?.contactName ?? profile.name}`);
    window.location.href = `mailto:${syncProfile?.contactEmail ?? profile.bookingEmail}?subject=${subj}&body=${body2}`;
  }

  const TrackEditor = ({ t, onDone }: { t: SyncTrack; onDone?: () => void }) => {
    const isNew = !t.title;
    const [form, setForm] = useState<SyncTrack>({ ...t });
    const [moodInput, setMoodInput] = useState("");
    const [themeInput, setThemeInput] = useState("");
    const [instrInput, setInstrInput] = useState("");
    const toggle = (field: "mood" | "theme" | "instrumentation", val: string) =>
      setForm(p => ({ ...p, [field]: p[field].includes(val) ? p[field].filter(x => x !== val) : [...p[field], val] }));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {isNew && (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.5rem" }}>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Track title *" style={inp} />
            <input value={form.albumTitle ?? ""} onChange={e => setForm(p => ({ ...p, albumTitle: e.target.value }))} placeholder="Album / EP (optional)" style={inp} />
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
          {[["isrc","ISRC"],["bpm","BPM"],["musicalKey","Key (e.g. G Major)"],["duration","Duration"]].map(([k, ph]) => (
            <input key={k} value={(form[k as keyof SyncTrack] as string | number) ?? ""} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} style={inp} />
          ))}
        </div>
        <textarea value={form.notes ?? ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Supervisor notes (placement ideas, scene types…)" rows={2} style={{ ...inp, resize: "vertical" }} />

        {/* Mood tags */}
        <div>
          <p style={{ ...lbl, marginBottom: "0.4rem" }}>Mood</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
            {form.mood.map(m => <TagChip key={m} label={m} color={tokens.accent} onRemove={() => toggle("mood", m)} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {ALL_MOODS.filter(m => !form.mood.includes(m)).map(m => (
              <button key={m} onClick={() => toggle("mood", m)} style={{ ...lbl, fontSize: "0.48rem", background: "transparent", border: border2, borderRadius: 3, padding: "2px 7px", cursor: "pointer", color: tokens.muted2 }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Theme tags */}
        <div>
          <p style={{ ...lbl, marginBottom: "0.4rem" }}>Theme</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
            {form.theme.map(t2 => <TagChip key={t2} label={t2} color="#4a8ec2" onRemove={() => toggle("theme", t2)} />)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {ALL_THEMES.filter(t2 => !form.theme.includes(t2)).map(t2 => (
              <button key={t2} onClick={() => toggle("theme", t2)} style={{ ...lbl, fontSize: "0.48rem", background: "transparent", border: border2, borderRadius: 3, padding: "2px 7px", cursor: "pointer", color: tokens.muted2 }}>{t2}</button>
            ))}
          </div>
        </div>

        {/* Instrumentation */}
        <div>
          <p style={{ ...lbl, marginBottom: "0.4rem" }}>Instrumentation</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
            {form.instrumentation.map(i => <TagChip key={i} label={i} color={tokens.muted} onRemove={() => toggle("instrumentation", i)} />)}
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input value={instrInput} onChange={e => setInstrInput(e.target.value)} placeholder="Add instrument…" style={{ ...inp, flex: 1 }} onKeyDown={e => { if (e.key === "Enter" && instrInput.trim()) { toggle("instrumentation", instrInput.trim()); setInstrInput(""); }}} />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {([["explicit","Explicit"],["hasInstrumental","Instrumental Available"],["hasStems","Stems Available"]] as const).map(([k, label]) => (
            <label key={k} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
              <input type="checkbox" checked={!!form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.checked }))} />
              <span style={lbl}>{label}</span>
            </label>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          <p style={lbl}>Status</p>
          {(["available","partial","unavailable"] as SyncLicensingStatus[]).map(s => (
            <button key={s} onClick={() => setForm(p => ({ ...p, licensingStatus: s }))} style={{ ...lbl, fontSize: "0.48rem", background: "transparent", border: `1px solid ${form.licensingStatus === s ? STATUS_COLOR[s] : tokens.border2}`, borderRadius: 3, padding: "3px 8px", cursor: "pointer", color: form.licensingStatus === s ? STATUS_COLOR[s] : tokens.muted2 }}>{STATUS_LABEL[s]}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => { if (!form.title.trim()) return; saveTrack(form); onDone?.(); }} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Save</button>
          <button onClick={() => { setEditingTrack(null); onDone?.(); }} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: border2, borderRadius: 3, padding: "6px 16px", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <section id="sync" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <div>
            <p className="section-label">Sync Licensing</p>
            <p style={{ ...body, fontSize: "0.72rem", marginTop: "0.3rem" }}>Music available for film · TV · advertising · games</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isArtist && <button onClick={() => setAddingTrack(true)} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 10px", cursor: "pointer" }}>+ Add Track</button>}
            {isArtist && <button onClick={() => { if (!syncProfile) onUpdate?.({ syncProfile: { tracks: [], pro: "", publisher: "", ipiNumber: "", contactName: "", contactEmail: "", syncReelUrl: "", stemFilesAvailable: false, instrumentalVersionsAvailable: false } }); setEditingProfile(true); }} style={{ ...lbl, background: "transparent", border: border2, borderRadius: 3, color: tokens.muted, padding: "4px 10px", cursor: "pointer" }}>Edit Profile</button>}
          </div>
        </div>

        {/* Sync profile card */}
        {syncProfile && (
          editingProfile && isArtist ? (
            <div style={{ background: surface, border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>Sync Profile</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {([["pro","PRO (BMI / ASCAP / SESAC)"],["publisher","Publisher"],["ipiNumber","IPI Number"],["contactName","Licensing Contact Name"],["contactEmail","Licensing Email"],["syncReelUrl","Sync Reel URL (YouTube)"]] as const).map(([k, ph]) => (
                  <input key={k} defaultValue={(syncProfile[k as keyof typeof syncProfile] as string) ?? ""} onBlur={e => saveSyncProfile({ [k]: e.target.value })} placeholder={ph} style={inp} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "1.5rem", marginBottom: "0.75rem" }}>
                {([["stemFilesAvailable","Stem Files Available"],["instrumentalVersionsAvailable","Instrumentals Available"]] as const).map(([k, label]) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked={!!syncProfile[k]} onChange={e => saveSyncProfile({ [k]: e.target.checked })} />
                    <span style={lbl}>{label}</span>
                  </label>
                ))}
              </div>
              <button onClick={() => setEditingProfile(false)} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 14px", cursor: "pointer" }}>Done</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: surface, border: border1, borderRadius: 8, padding: "16px 18px" }}>
                <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Licensing Info</p>
                {syncProfile.pro && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}><span style={lbl}>PRO</span><span style={{ ...body, color: tokens.text }}>{syncProfile.pro}</span></div>}
                {syncProfile.publisher && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}><span style={lbl}>Publisher</span><span style={{ ...body, color: tokens.text }}>{syncProfile.publisher}</span></div>}
                {syncProfile.ipiNumber && <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}><span style={lbl}>IPI</span><span style={{ ...body, color: tokens.text }}>{syncProfile.ipiNumber}</span></div>}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}><span style={lbl}>Stems</span><span style={{ ...lbl, color: syncProfile.stemFilesAvailable ? "#5aab72" : tokens.muted2 }}>{syncProfile.stemFilesAvailable ? "Available" : "Not available"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}><span style={lbl}>Instrumentals</span><span style={{ ...lbl, color: syncProfile.instrumentalVersionsAvailable ? "#5aab72" : tokens.muted2 }}>{syncProfile.instrumentalVersionsAvailable ? "Available" : "Not available"}</span></div>
              </div>
              <div style={{ background: surface, border: border1, borderRadius: 8, padding: "16px 18px" }}>
                <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Licensing Contact</p>
                {syncProfile.contactName && <p style={{ ...T, fontSize: "0.88rem", fontWeight: 500, color: tokens.text, marginBottom: "0.25rem" }}>{syncProfile.contactName}</p>}
                {syncProfile.contactEmail && <a href={`mailto:${syncProfile.contactEmail}`} style={{ ...body, color: tokens.accent, textDecoration: "none", display: "block", marginBottom: "0.75rem" }}>{syncProfile.contactEmail}</a>}
                {syncProfile.syncReelUrl && <a href={syncProfile.syncReelUrl} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, textDecoration: "none" }}>Sync Reel →</a>}
                {!syncProfile.contactName && !syncProfile.contactEmail && <p style={{ ...lbl, color: tokens.muted2 }}>No contact set</p>}
              </div>
            </div>
          )
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            {(["all","available","partial","unavailable"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ ...lbl, fontSize: "0.48rem", background: "transparent", borderRadius: 3, padding: "3px 8px", cursor: "pointer", border: `1px solid ${statusFilter === s ? (s === "all" ? tokens.accent : STATUS_COLOR[s as SyncLicensingStatus]) : tokens.border2}`, color: statusFilter === s ? (s === "all" ? tokens.accent : STATUS_COLOR[s as SyncLicensingStatus]) : tokens.muted2 }}>{s === "all" ? "All" : STATUS_LABEL[s as SyncLicensingStatus]}</button>
            ))}
          </div>
          <select value={moodFilter ?? ""} onChange={e => setMoodFilter(e.target.value || null)} style={{ ...lbl, fontSize: "0.5rem", background: surface, border: border2, borderRadius: 3, color: tokens.muted, padding: "3px 8px", cursor: "pointer" }}>
            <option value="">Mood: All</option>
            {allMoodsInCatalog.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={themeFilter ?? ""} onChange={e => setThemeFilter(e.target.value || null)} style={{ ...lbl, fontSize: "0.5rem", background: surface, border: border2, borderRadius: 3, color: tokens.muted, padding: "3px 8px", cursor: "pointer" }}>
            <option value="">Theme: All</option>
            {allThemesInCatalog.map(t2 => <option key={t2} value={t2}>{t2}</option>)}
          </select>
          {(moodFilter || themeFilter || statusFilter !== "all") && (
            <button onClick={() => { setMoodFilter(null); setThemeFilter(null); setStatusFilter("all"); }} style={{ ...lbl, background: "transparent", border: "none", color: "#d95c5c", cursor: "pointer", padding: 0 }}>Clear ×</button>
          )}
          <p style={{ ...lbl, marginLeft: "auto" }}>{filtered.length} tracks</p>
        </div>

        {/* Track list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.length === 0 && <p style={body}>No tracks match the current filters.</p>}
          {filtered.map(t => {
            const trackKey = `${t.title}|${t.albumTitle}`;
            const isOpen = expandedTrack === trackKey;
            const isEditingThis = editingTrack?.title === t.title && editingTrack?.albumTitle === t.albumTitle;
            return (
              <div key={trackKey} style={{ background: surface, border: border1, borderRadius: 8, overflow: "hidden" }}>

                {/* Track row */}
                <button onClick={() => setExpandedTrack(isOpen ? null : trackKey)} style={{
                  width: "100%", background: "transparent", border: "none", cursor: "pointer",
                  display: "grid", gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto auto auto auto",
                  gap: "1rem", alignItems: "center", padding: "14px 18px", textAlign: "left",
                }}>
                  <div>
                    <p style={{ ...T, fontSize: "0.88rem", fontWeight: 500, color: tokens.text }}>{t.title}</p>
                    {t.albumTitle && <p style={{ ...lbl, marginTop: "0.15rem", color: tokens.muted2 }}>{t.albumTitle}</p>}
                  </div>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                    {t.mood.slice(0, 2).map(m => <TagChip key={m} label={m} color={tokens.accent} />)}
                  </div>
                  {t.bpm && <p style={{ ...lbl, color: tokens.muted2 }}>{t.bpm} BPM</p>}
                  <span style={{ ...lbl, fontSize: "0.48rem", color: STATUS_COLOR[t.licensingStatus], border: `1px solid ${STATUS_COLOR[t.licensingStatus]}`, borderRadius: 3, padding: "1px 6px" }}>{STATUS_LABEL[t.licensingStatus]}</span>
                  <p style={{ ...lbl, color: tokens.muted2 }}>{isOpen ? "▾" : "▸"}</p>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: border2, padding: "16px 18px" }}>
                    {isEditingThis ? (
                      <TrackEditor t={editingTrack!} />
                    ) : (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                          {/* Metadata */}
                          <div>
                            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>Track Info</p>
                            {[["Key", t.musicalKey],["BPM", t.bpm],["Duration", t.duration],["ISRC", t.isrc]].map(([k, v]) => v ? (
                              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}>
                                <span style={lbl}>{k}</span>
                                <span style={{ ...body, color: tokens.text }}>{String(v)}</span>
                              </div>
                            ) : null)}
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}>
                              <span style={lbl}>Explicit</span>
                              <span style={{ ...lbl, color: t.explicit ? "#d4893a" : "#5aab72" }}>{t.explicit ? "Yes" : "Clean"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: border2 }}>
                              <span style={lbl}>Instrumental</span>
                              <span style={{ ...lbl, color: t.hasInstrumental ? "#5aab72" : tokens.muted2 }}>{t.hasInstrumental ? "Available" : "No"}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                              <span style={lbl}>Stems</span>
                              <span style={{ ...lbl, color: t.hasStems ? "#5aab72" : tokens.muted2 }}>{t.hasStems ? "Available" : "No"}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.5rem" }}>Mood</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
                              {t.mood.map(m => <TagChip key={m} label={m} color={tokens.accent} />)}
                            </div>
                            <p style={{ ...lbl, color: "#4a8ec2", marginBottom: "0.5rem" }}>Theme</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
                              {t.theme.map(th => <TagChip key={th} label={th} color="#4a8ec2" />)}
                            </div>
                            <p style={{ ...lbl, marginBottom: "0.5rem" }}>Instrumentation</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                              {t.instrumentation.map(i => <TagChip key={i} label={i} color={tokens.muted} />)}
                            </div>
                          </div>
                        </div>

                        {t.notes && (
                          <div style={{ background: isLt ? "#e8e8e8" : "#0e0e0e", border: border2, borderRadius: 6, padding: "10px 14px", marginBottom: "1rem" }}>
                            <p style={{ ...lbl, marginBottom: "0.3rem", color: tokens.accent }}>Supervisor Notes</p>
                            <p style={{ ...body, lineHeight: 1.7 }}>{t.notes}</p>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.5rem", borderTop: border2 }}>
                          <button onClick={() => pitchEmail(t)} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "5px 14px", cursor: "pointer" }}>Pitch This Track →</button>
                          {t.spotifyUrl && <a href={t.spotifyUrl} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.muted, border: border2, borderRadius: 3, padding: "5px 14px", textDecoration: "none" }}>Preview ↗</a>}
                          {isArtist && <button onClick={() => setEditingTrack(t)} style={{ ...lbl, background: "transparent", color: tokens.accent, border: `1px solid ${tokens.accent}44`, borderRadius: 3, padding: "5px 12px", cursor: "pointer", marginLeft: "auto" }}>Edit</button>}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add track form */}
        {addingTrack && isArtist && (
          <div style={{ marginTop: "1rem", background: surface, border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "1.25rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.75rem" }}>New Sync Track</p>
            <TrackEditor t={{ ...BLANK_TRACK }} onDone={() => setAddingTrack(false)} />
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: border1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...T, fontSize: "0.88rem", fontWeight: 500, color: tokens.text, marginBottom: "0.25rem" }}>Looking for something specific?</p>
            <p style={{ ...body, fontSize: "0.78rem" }}>Reach out with your project details — custom sessions and alternate arrangements available.</p>
          </div>
          <a href={`mailto:${syncProfile?.contactEmail ?? profile.bookingEmail}`} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 4, padding: "10px 20px", textDecoration: "none", flexShrink: 0 }}>Get In Touch →</a>
        </div>
      </div>
    </section>
  );
}
