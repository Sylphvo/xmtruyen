import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  return (
    <div
      style={{
        width: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 56px",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#111",
          marginBottom: 8,
        }}
      >
        Quên mật khẩu
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.5 }}>
        Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác minh để giúp bạn khôi phục lại mật khẩu.
      </p>

      {/* Email */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <label
          style={{
            position: "absolute",
            top: -8,
            left: 10,
            fontSize: 11,
            color: "#666",
            background: "#fff",
            padding: "0 4px",
          }}
        >
          Email
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 14px",
            border: "1.5px solid #ccc",
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            backgroundColor: "#fff",
            fontFamily: "inherit",
            color: "#222",
          }}
        />
      </div>

      {/* Submit button */}
      <button
        style={{
          width: "100%",
          padding: 13,
          background: "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          marginTop: 8,
        }}
      >
        Gửi mã khôi phục
      </button>

      {/* Back to Login */}
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#666",
          marginTop: 16,
        }}
      >
        Nhớ mật khẩu rồi?{" "}
        <Link
          to="/login"
          style={{
            color: "#2196f3",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
