
import { ACCENT } from "../../constants";
import { BookOpen } from "lucide-react";

export default function Footer() {
  const footerCols = [
    { title: "Services", items: ["Email Marketing", "Campaigns", "Branding", "Offline"] },
    { title: "About",    items: ["Our Story", "Benefits", "Team", "Contact us"] },
    { title: "Contact",  items: ["Contact us"] },
    { title: "Follow Us",items: ["Facebook", "Twitter", "Instagram"] },
  ];
 
  return (
    <footer
      style={{
        backgroundColor: "#252525",
        color: "#888",
        padding: "36px 28px 20px",
        fontSize: 12,
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: 28,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                backgroundColor: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={14} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Đọc Sách</span>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.8, margin: 0, color: "#666" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit,
            vulputate eu pharetra nec, mattis ac neque.
          </p>
        </div>
 
        {footerCols.map(({ title, items }) => (
          <div key={title}>
            <p style={{ color: "#ddd", fontWeight: 700, marginBottom: 12, margin: "0 0 12px", fontSize: 12 }}>
              {title}
            </p>
            {items.map((item) => (
              <p
                key={item}
                style={{ margin: "0 0 9px", cursor: "pointer", color: "#666", fontSize: 11 }}
              >
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>
 
      <div
        style={{
          marginTop: 28,
          borderTop: "1px solid #333",
          paddingTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10,
          color: "#4a4a4a",
        }}
      >
        <span>Copyright © 2024 Loship.vn. All Rights Reserved.</span>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ cursor: "pointer" }}>Terms &amp; Conditions</span>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}