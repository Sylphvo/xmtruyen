import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileAvatar() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
      
      {/* Avatar Image */}
      <div style={{
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#e5e7eb",
        border: "4px solid #f5f1eb", // Blends with background
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        {/* Placeholder image resembling the one in the mockup */}
        <div style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #ef4444 0%, #3b82f6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "64px",
          fontWeight: 700
        }}>
          <img 
            src="/src/assets/images/mock-avatar.jpg" 
            alt="Profile" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerText = 'HQ';
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "140px" }}>
        <button 
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 2px 4px rgba(33, 150, 243, 0.2)"
          }}
        >
          Thay ảnh
        </button>

        <button 
          onClick={() => {
            // Logic đăng xuất
            navigate("/login");
          }}
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            boxShadow: "0 2px 4px rgba(33, 150, 243, 0.2)"
          }}
        >
          Đăng xuất
        </button>
      </div>

    </div>
  );
}
