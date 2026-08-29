import React from "react";
import ProfileForm from "../components/Profile/ProfileForm";
import ProfileAvatar from "../components/Profile/ProfileAvatar";
import Footer from "../components/Layout/Footer";

export default function ProfilePage() {
  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "60px 80px", flex: 1, display: "flex", justifyContent: "center" }}>

        <div style={{
          display: "flex",
          gap: "80px",
          maxWidth: "800px",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}>

          {/* Left Side: Form */}
          <div style={{ flex: 1 }}>
            <ProfileForm />
          </div>

          {/* Right Side: Avatar & Buttons */}
          <div style={{ paddingRight: "40px" }}>
            <ProfileAvatar />
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
