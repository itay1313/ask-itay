import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a08",
          color: "#e2b15e",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          borderRadius: 7,
          fontStyle: "italic",
        }}
      >
        A?
      </div>
    ),
    { ...size },
  );
}
