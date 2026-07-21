import { ImageResponse } from "next/og";

export const alt = "Galata KGK — Galata'da Okunur, Gelecek Burada Kurulur";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#1B2A5E",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        padding: "72px 84px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "42px solid rgba(232,93,44,0.22)",
          borderRadius: "999px",
          display: "flex",
          height: 310,
          position: "absolute",
          right: -95,
          top: -110,
          width: 310,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div
          style={{
            color: "#F59B78",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          İstanbul Galata Üniversitesi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            marginTop: 28,
            maxWidth: 980,
          }}
        >
          Kariyer ve Girişimcilik Kulübü
        </div>
        <div
          style={{
            color: "#C4CBE1",
            display: "flex",
            fontSize: 30,
            marginTop: 34,
          }}
        >
          Galata&apos;da Okunur, Gelecek Burada Kurulur
        </div>
      </div>
    </div>,
    size,
  );
}
