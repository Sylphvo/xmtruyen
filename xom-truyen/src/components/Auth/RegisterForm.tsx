import React from "react";

export default function RegisterForm() {
  return (
    <div
      style={{
        width: 420,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 56px",
        flexShrink: 0,
      }}
    >
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: "#111",
          marginBottom: 24,
        }}
      >
        Đăng ký
      </h1>

      {/* Code các input Email, Password, Nhập lại Password vào đây */}
      <div
        style={{
          padding: "20px",
          background: "#f9f9f9",
          borderRadius: 8,
          border: "1px dashed #ccc",
          textAlign: "center",
          color: "#666",
        }}
      >
        Form đăng ký của bạn ở đây...
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#666",
          marginTop: 16,
        }}
      >
        Đã có tài khoản?{" "}
        <a
          style={{
            color: "#2196f3",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Đăng nhập
        </a>
      </p>
    </div>
  );
}
