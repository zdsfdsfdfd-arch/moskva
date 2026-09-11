import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Raster favicon for browsers without SVG favicon support; same window-with-a-gleam mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        <div style={{ position: "relative", display: "flex", width: 56, height: 56, borderRadius: 13, background: "#a9e4f7", border: "5px solid #1b1f2a" }}>
          <div style={{ position: "absolute", left: 21, top: 0, width: 5, height: 46, background: "#1b1f2a" }} />
          <div style={{ position: "absolute", top: 21, left: 0, height: 5, width: 46, background: "#1b1f2a" }} />
          <div style={{ position: "absolute", right: 5, top: 5, width: 13, height: 13, borderRadius: 999, background: "#ffd23f", border: "3px solid #1b1f2a" }} />
        </div>
      </div>
    ),
    size,
  );
}
