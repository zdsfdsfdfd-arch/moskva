import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/data/brand";

export const alt = "БЛИК — мойка окон в Москве";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Fonts are bundled (OFL) so the image renders without network access at build time. */
async function loadFonts() {
  const dir = join(process.cwd(), "src/assets/fonts");
  const [display, text] = await Promise.all([
    readFile(join(dir, "unbounded-900.woff")),
    readFile(join(dir, "onest-500.woff")),
  ]);
  return [
    { name: "Unbounded", data: display, weight: 900 as const, style: "normal" as const },
    { name: "Onest", data: text, weight: 500 as const, style: "normal" as const },
  ];
}

export default async function OpenGraphImage() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f1e7",
          padding: 56,
          fontFamily: "Onest, sans-serif",
        }}
      >
        {/* window */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            border: "6px solid #1b1f2a",
            borderRadius: 18,
            background: "#fff9ee",
            padding: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              border: "5px solid #1b1f2a",
              borderRadius: 8,
              background: "linear-gradient(180deg, #5bc3e8 0%, #d8f3fc 100%)",
              padding: 48,
              position: "relative",
            }}
          >
            {/* skyline */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end", gap: 14, padding: "0 40px" }}>
              {[140, 90, 210, 120, 170, 80, 230, 110, 150, 190, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 78,
                    height: h,
                    background: ["#eadfcb", "#e9b8a4", "#bfe3d6", "#f3e2a2", "#f0c8c0"][i % 5],
                    border: "4px solid #1b1f2a",
                    borderBottom: "none",
                    borderRadius: "6px 6px 0 0",
                  }}
                />
              ))}
            </div>
            {/* sun */}
            <div style={{ position: "absolute", right: 90, top: 60, width: 110, height: 110, borderRadius: 999, background: "#ffd23f", border: "5px solid #1b1f2a" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", position: "relative", width: 56, height: 56, borderRadius: 12, background: "#a9e4f7", border: "5px solid #1b1f2a" }}>
                <div style={{ position: "absolute", left: 21, top: 0, width: 5, height: 46, background: "#1b1f2a" }} />
                <div style={{ position: "absolute", top: 21, left: 0, height: 5, width: 46, background: "#1b1f2a" }} />
                <div style={{ position: "absolute", right: 6, top: 6, width: 12, height: 12, borderRadius: 999, background: "#ffd23f", border: "3px solid #1b1f2a" }} />
              </div>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: 44, fontWeight: 900, color: "#1b1f2a", letterSpacing: -2 }}>{brand.name}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760, position: "relative" }}>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: 64, fontWeight: 900, lineHeight: 1.02, color: "#1b1f2a", letterSpacing: -2 }}>
                Окна, через которые хочется смотреть.
              </div>
              <div style={{ fontSize: 28, color: "#1b1f2a", background: "#fff9ee", border: "4px solid #1b1f2a", borderRadius: 999, padding: "10px 24px", alignSelf: "flex-start" }}>
                Мойка окон в Москве и области
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
