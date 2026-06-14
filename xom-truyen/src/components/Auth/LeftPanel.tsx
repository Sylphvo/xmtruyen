import React from "react";

export default function LeftPanel() {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        background: "#f5f0e8",
        overflow: "hidden",
      }}
    >
      {/* Organic blobs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -60,
          width: 360,
          height: 340,
          background: "#ebe4d6",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -80,
          width: 500,
          height: 440,
          background: "#e0d8c8",
          borderRadius: "40% 60% 30% 70% / 60% 30% 70% 40%",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 50,
          width: 340,
          height: 300,
          background: "rgba(255,255,255,0.45)",
          borderRadius: "50% 50% 40% 60% / 40% 60% 40% 60%",
          zIndex: 3,
        }}
      />

      {/* Book covers */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: 0,
          display: "flex",
          alignItems: "flex-end",
          zIndex: 5,
          paddingLeft: 12,
        }}
      >
        {/* Book covers will be added here once BookCovers.tsx is defined */}
      </div>
    </div>
  );
}
