"use client";

import { useEffect, useState } from "react";
import { Artist } from "@/lib/data";

interface NavbarProps {
  artist: Artist;
}

export default function Navbar({ artist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { label: "Music",      href: `${artist.homeRoute}#music` },
    { label: "Shows",      href: "/shows"                    },
    { label: "Videos",     href: "/videos"                   },
    { label: "EPK",        href: "/epk"                      },
    { label: "Stage Plot", href: "/stage-plot"               },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: "blur(18px) saturate(1.4)",
        WebkitBackdropFilter: "blur(18px) saturate(1.4)",
        background: scrolled
          ? "rgba(12,11,9,0.88)"
          : "rgba(12,11,9,0.0)",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 28px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Band name / logo */}
        <a
          href="#top"
          style={{
            fontFamily: "var(--display-font)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
            letterSpacing: "0.04em",
            color: "var(--text)",
            textDecoration: "none",
            lineHeight: 1,
          }}
        >
          {artist.name}
        </a>

        {/* Nav links */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontFamily: "monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: hoveredLink === link.href
                  ? "var(--accent-warm)"
                  : "var(--muted)",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </a>
          ))}

          {/* CTA — booking */}
          {artist.bookingEmail && (
            <a
              href={`mailto:${artist.bookingEmail}`}
              style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                padding: "7px 16px",
                borderRadius: "9999px",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "var(--accent)";
                el.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background = "transparent";
                el.style.color = "var(--accent)";
              }}
            >
              Booking
            </a>
          )}
        </nav>

      </div>
    </header>
  );
}
