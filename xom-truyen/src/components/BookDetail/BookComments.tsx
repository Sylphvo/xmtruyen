import React from "react";

export default function BookComments() {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "20px" }}>
        Bình luận (1)
      </h2>
      
      <div style={{ 
        backgroundColor: "#ffffff", 
        borderRadius: "12px", 
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", gap: "16px" }}>
          {/* Avatar */}
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#e74c3c",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {/* Fallback avatar shape/color like in the image */}
            <div style={{ width: "100%", height: "100%", backgroundColor: "#c0392b", position: "relative" }}>
               <div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)", width: "24px", height: "24px", backgroundColor: "#111", borderRadius: "50%" }}></div>
            </div>
          </div>
          
          {/* Comment Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>
                Harleen Quinzel
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563" }}>
                11:22 PM
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#374151" }}>
              AMAZING!!!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
