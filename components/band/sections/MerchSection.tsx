"use client";

import { useState } from "react";
import type { ProfileData } from "@/lib/bandProfile";
import type { TokenSet } from "@/lib/genreTokens";
import { useMobile } from "@/lib/useMobile";
import EditField from "@/components/band/EditField";

interface Props {
  profile: ProfileData;
  tokens: TokenSet;
  isArtist?: boolean;
  onUpdate?: (u: Partial<ProfileData>) => void;
}

const CATS = ["All", "Apparel", "Vinyl", "Accessories", "Digital"];
const PRODUCT_CATS = ["Apparel", "Vinyl", "Accessories", "Digital"];

export default function MerchSection({ profile, tokens, isArtist, onUpdate }: Props) {
  const isMobile = useMobile();
  const [activeCat, setActiveCat] = useState("All");
  const [addingProduct, setAddingProduct] = useState(false);
  const [pTitle, setPTitle] = useState("");
  const [pCat, setPCat] = useState("Apparel");
  const [pPrice, setPPrice] = useState("");
  const [pUrl, setPUrl] = useState("");
  const [pImg, setPImg] = useState("");

  const isLt = profile.colorMode === "light";
  const T: React.CSSProperties   = { fontFamily: "Inter, system-ui, sans-serif" };
  const lbl: React.CSSProperties = { ...T, fontSize: "0.58rem", letterSpacing: "0.13em", textTransform: "uppercase", color: tokens.muted2, fontWeight: 500 };
  const border1 = `1px solid ${tokens.border}`;
  const border2 = `1px solid ${tokens.border2}`;
  const inp: React.CSSProperties = { background: isLt ? "#fff" : "#0e0e0e", border: `1px solid ${tokens.border}`, borderRadius: 4, color: tokens.text, padding: "5px 8px", fontSize: "0.8rem", fontFamily: "Inter, sans-serif", outline: "none" };
  const addBtn: React.CSSProperties = { background: "transparent", border: `1px dashed ${tokens.accent}55`, borderRadius: 4, color: tokens.accent, fontSize: "0.68rem", padding: "5px 12px", cursor: "pointer", ...T, letterSpacing: "0.05em" };

  const merchUrl     = profile.merchUrl ?? "";
  const allProducts: any[] = (profile as any).merch ?? [];
  const filtered = activeCat === "All" ? allProducts : allProducts.filter((p: any) => p.category === activeCat);

  const badgeColor: Record<string, string> = {
    "New": tokens.accent, "Best Seller": "#5aab72", "Low Stock": "#d95c5c",
  };

  function saveProduct() {
    if (!pTitle.trim()) return;
    const next = [...allProducts, { title: pTitle.trim(), category: pCat, price: pPrice.trim() || undefined, url: pUrl.trim() || undefined, img: pImg.trim() || undefined }];
    onUpdate?.({ merch: next } as any);
    setPTitle(""); setPCat("Apparel"); setPPrice(""); setPUrl(""); setPImg(""); setAddingProduct(false);
  }

  function deleteProduct(i: number) {
    const toDelete = filtered[i];
    onUpdate?.({ merch: allProducts.filter(p => p !== toDelete) } as any);
  }

  return (
    <section id="merch" style={{ borderBottom: border1 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 40px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: border1 }}>
          <p className="section-label">Official Merch Store</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isArtist && (
              <EditField
                value={merchUrl}
                onSave={v => onUpdate?.({ merchUrl: v })}
                placeholder="Store URL"
                accentColor={tokens.accent}
                style={{ ...lbl, color: tokens.muted2 }}
              />
            )}
            {merchUrl && !isArtist && (
              <a href={merchUrl} target="_blank" rel="noreferrer" style={{ ...lbl, color: tokens.accent, textDecoration: "none" }}>View Full Store →</a>
            )}
            {isArtist && (
              <button onClick={() => setAddingProduct(a => !a)} style={addBtn}>+ Add Product</button>
            )}
          </div>
        </div>

        {isArtist && addingProduct && (
          <div style={{ background: isLt ? "#f4f4f4" : "#111", border: `1px solid ${tokens.accent}44`, borderRadius: 8, padding: "14px", marginBottom: "1.5rem" }}>
            <p style={{ ...lbl, color: tokens.accent, marginBottom: "0.6rem" }}>New Product</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "0.4rem", marginBottom: "0.4rem" }}>
              <input value={pTitle} onChange={e => setPTitle(e.target.value)} placeholder="Product title" style={inp} autoFocus />
              <select value={pCat} onChange={e => setPCat(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {PRODUCT_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <input value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="Price (e.g. $28)" style={inp} />
              <input value={pUrl} onChange={e => setPUrl(e.target.value)} placeholder="Product URL (optional)" style={inp} />
              <input value={pImg} onChange={e => setPImg(e.target.value)} placeholder="Image URL (optional)" style={inp} onKeyDown={e => { if (e.key === "Enter") saveProduct(); if (e.key === "Escape") setAddingProduct(false); }} />
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={saveProduct} style={{ ...lbl, background: tokens.accent, color: isLt ? "#fff" : "#000", border: "none", borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Add</button>
              <button onClick={() => setAddingProduct(false)} style={{ ...lbl, background: "transparent", color: tokens.muted2, border: `1px solid ${tokens.border2}`, borderRadius: 3, padding: "4px 12px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {allProducts.length === 0 ? (
          <p style={{ ...T, fontSize: "0.85rem", color: tokens.muted2 }}>No merch added yet.{isArtist ? " Add a store URL and products above." : ""}</p>
        ) : (
          <>
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
              {CATS.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{
                  ...lbl,
                  color: activeCat === cat ? (isLt ? "#000" : "#fff") : tokens.muted2,
                  background: activeCat === cat ? (isLt ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)") : "transparent",
                  border: border2, borderRadius: 3, padding: "4px 12px", cursor: "pointer",
                }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1rem" }}>
              {filtered.map((product: any, i: number) => (
                <div key={i} style={{ position: "relative" }}>
                  {isArtist && (
                    <button onClick={() => deleteProduct(i)} style={{ position: "absolute", top: 8, right: 8, zIndex: 10, background: "rgba(0,0,0,0.6)", color: "#d95c5c", border: "none", borderRadius: 3, padding: "2px 7px", fontSize: "0.65rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>✕</button>
                  )}
                  <a href={product.url ?? merchUrl ?? "#"} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <div
                      style={{ background: isLt ? "#f4f4f4" : "#111", border: border1, borderRadius: 8, overflow: "hidden", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = tokens.accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = tokens.border)}
                    >
                      <div style={{ aspectRatio: "1 / 1", background: isLt ? "#e4e4e4" : "#181818", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {product.img ? (
                          <img src={product.img} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={tokens.muted2} strokeWidth="0.6">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                          </svg>
                        )}
                        {product.badge && (
                          <div style={{ position: "absolute", top: 8, left: 8, background: badgeColor[product.badge] ?? tokens.accent, ...lbl, color: "#fff", fontSize: "0.5rem", padding: "2px 7px", borderRadius: 3 }}>{product.badge}</div>
                        )}
                      </div>
                      <div style={{ padding: "10px 12px 12px" }}>
                        <p style={{ ...lbl, color: tokens.muted2, marginBottom: "0.25rem" }}>{product.category}</p>
                        <p style={{ ...T, fontSize: "0.8rem", fontWeight: 400, color: tokens.text, lineHeight: 1.4, marginBottom: "0.5rem" }}>{product.title}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {product.price && <p style={{ ...T, fontSize: "0.88rem", fontWeight: 600, color: tokens.text }}>{product.price}</p>}
                          <span style={{ ...lbl, color: tokens.accent }}>Buy →</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
