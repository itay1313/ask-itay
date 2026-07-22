import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ask Itay — Don't read my CV. Ask it.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a08",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(226,177,94,0.12), transparent 70%)",
          color: "#f2efe8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 10,
            color: "#9b968c",
            textTransform: "uppercase",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Itay Haephrati / Design + Code + AI
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 40,
            fontSize: 92,
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex" }}>Don&rsquo;t read my CV.</div>
          <div style={{ display: "flex", fontStyle: "italic", color: "#e2b15e" }}>Ask it.</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 24,
            color: "#9b968c",
            fontFamily: "Arial, sans-serif",
          }}
        >
          ask-itay.vercel.app — an AI interview over 13+ years of design &amp; code
        </div>
      </div>
    ),
    { ...size },
  );
}
