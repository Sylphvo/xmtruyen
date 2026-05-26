import { ChevronRight } from "lucide-react";
import { ACCENT } from "../../constants";

export default function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            color: ACCENT,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h2>
        <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>{subtitle}</span>
      </div>
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          color: ACCENT,
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: 0,
          fontWeight: 600,
        }}
      >
        Xem thêm <ChevronRight size={12} />
      </button>
    </div>
  );
}