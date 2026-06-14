import React from "react";
import AuthLayout from "../components/Layout/AuthLayout";
// Import ForgotPasswordForm của bạn vào...

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Quên mật khẩu">
      {/* <ForgotPasswordForm /> */}
      <div
        style={{
          width: 420,
          padding: "48px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Quên mật khẩu?</h1>
        <p>Nhập email để nhận mã xác minh...</p>
      </div>
    </AuthLayout>
  );
}
