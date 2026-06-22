import React from "react";

export default function LeftPanel() {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        background: "#f0ece1", // Match the light cream background in the image
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Decorative Blob */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "20%",
        width: "50px",
        height: "50px",
        background: "#e3dfd3",
        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
        transform: "rotate(45deg)",
      }} />

      {/* Book Covers Container */}
      <div style={{ position: "relative", width: "400px", height: "450px" }}>
        
        {/* Left Book (The Wind in the Willows style) */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "0",
            width: "200px",
            height: "300px",
            backgroundImage: "url(/src/assets/images/Truyen-Tranh-Ngon-Tinh-01.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "4px",
            boxShadow: "-10px 10px 20px rgba(0,0,0,0.2)",
            transform: "rotate(-8deg)",
            zIndex: 1,
          }}
        />

        {/* Right Book (Around the World in 80 Days style) */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "0",
            width: "200px",
            height: "300px",
            backgroundImage: "url(/src/assets/images/Truyen-Tranh-Ngon-Tinh-02.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "4px",
            boxShadow: "10px 10px 20px rgba(0,0,0,0.2)",
            transform: "rotate(10deg)",
            zIndex: 2,
          }}
        />

        {/* Center Book (Les Misérables style) */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "220px",
            height: "340px",
            backgroundImage: "url(/src/assets/images/Truyen-Tranh-Ngon-Tinh-Hien-Dai.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "4px",
            boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
            zIndex: 3,
          }}
        />

      </div>

      {/* Complex Wavy SVG Overlay matching the image design */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "350px", // Takes up a good portion of the right side of the left panel
          zIndex: 10,
          pointerEvents: "none",
          filter: "drop-shadow(-15px 0px 20px rgba(0,0,0,0.15))"
        }}
        viewBox="0 0 350 800"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          d="
            M350,0 
            L350,800 
            L250,800 
            C280,750 320,700 250,650 
            C180,600 200,550 250,500 
            C300,450 320,380 250,300 
            C150,180 300,100 250,0 
            Z
          "
        />
        {/* Floating disconnected white blob (like in the image top middle) */}
        <path
          fill="#ffffff"
          d="M 120,80 C 140,70 160,90 150,110 C 140,130 110,130 100,110 C 90,90 100,90 120,80 Z"
        />
        {/* Floating hole / negative space blob (simulated as cut-out or extra blob) */}
        <path
          fill="#ffffff"
          d="M 160,650 C 190,630 200,670 180,690 C 160,710 140,680 160,650 Z"
        />
      </svg>
    </div>
  );
}
