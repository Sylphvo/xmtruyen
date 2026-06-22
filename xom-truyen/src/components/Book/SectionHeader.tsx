import { ChevronRight } from "lucide-react";
import { ACCENT } from "../../constants";

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
        paddingLeft: 25,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#111827", // Mã màu tối gần như đen giống Figma
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis", // Cắt chữ dài thành "..."
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>
        <span style={{ fontSize: 11, color: "#bbb", fontWeight: 400 }}>
          {subtitle}
        </span>
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
