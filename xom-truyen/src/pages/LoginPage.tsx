import React from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import LoginForm from "../components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Đăng nhập">
      <LoginForm />
    </AuthLayout>
  );
}
