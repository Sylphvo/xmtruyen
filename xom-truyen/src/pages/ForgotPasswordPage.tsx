import React from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title='Quên mật khẩu'>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
