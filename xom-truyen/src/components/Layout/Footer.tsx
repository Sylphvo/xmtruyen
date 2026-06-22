import { ACCENT } from "../../constants";
import { BookOpen } from "lucide-react";

export default function Footer() {
  const footerCols = [
    {
      title: "Services",
      items: ["Email Marketing", "Campaigns", "Branding", "Offline"],
    },
    {
      title: "About",
      items: ["Our Story", "Benefits", "Team", "Careers"]
    },
    {
      title: "Follow Us",
      items: [
        { name: "Facebook" },
        { name: "Twitter" },
        { name: "Instagram" }
      ]
    },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1.5px solid var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={18} color="var(--text-primary)" />
            </div>
          </div>
          <p
            style={{ fontSize: 11, lineHeight: 1.8, margin: 0, color: "var(--text-muted, #666)", paddingRight: "40px" }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div style={{ display: "flex", gap: "60px", gridColumn: "span 3" }}>
          {footerCols.map(({ title, items }) => (
            <div key={title} style={{ flex: 1 }}>
              <p
                style={{
                  fontWeight: 500,
                  margin: "0 0 16px",
                  fontSize: 12,
                  color: "#9ca3af"
                }}
              >
                {title}
              </p>
              {items.map((item) => (
                <p
                  key={typeof item === 'string' ? item : item.name}
                  style={{
                    margin: "0 0 12px",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 500
                  }}
                >
                  {typeof item !== 'string' && item.icon}
                  {typeof item === 'string' ? item : item.name}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 10,
          color: "#6b7280",
        }}
      >
        <span>Copyright © 2020. LogoIpsum. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24, color: "#4b5563" }}>
          <span style={{ cursor: "pointer" }}>Terms & Conditions</span>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
}
