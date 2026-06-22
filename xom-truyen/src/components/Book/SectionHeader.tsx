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
        justifyContent: "flex-start",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--text-primary)",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          {title}
        </h3>
        <span style={{ fontSize: 14, color: "var(--text-muted, #888)", fontWeight: 500, cursor: "pointer" }}>
          {subtitle}
        </span>
      </div>
    </div>
  );
}
