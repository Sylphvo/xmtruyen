import React from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout title="Đăng ký tài khoản">
      <RegisterForm />
    </AuthLayout>
  );
}
