import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword, loading, error } = useAuth() as any;
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1
  const [email, setEmail] = useState("");
  
  // Step 2
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMessage(null);
    const res = await forgotPassword(email);
    if (res.success) {
      setStep(2);
      setMessage("Mã xác nhận đã được gửi đến email của bạn.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    setMessage(null);
    const res = await resetPassword({ token: otp, newPassword });
    if (res.success) {
      alert("Khôi phục mật khẩu thành công. Vui lòng đăng nhập lại.");
      navigate("/login");
    }
  };

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
        {step === 1 ? "Quên mật khẩu" : "Tạo mật khẩu mới"}
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.5 }}>
        {step === 1 
          ? "Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác minh để giúp bạn khôi phục lại mật khẩu."
          : "Vui lòng nhập mã xác minh (OTP) đã được gửi đến email của bạn và tạo mật khẩu mới."}
      </p>

      {(error || message) && (
        <div style={{
          padding: "10px",
          marginBottom: "16px",
          borderRadius: "8px",
          fontSize: "13px",
          backgroundColor: error ? "#fee2e2" : "#dcfce7",
          color: error ? "#dc2626" : "#16a34a",
        }}>
          {error || message}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp}>
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
              required
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 13,
              background: loading ? "#ccc" : "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginTop: 8,
            }}
          >
            {loading ? "Đang xử lý..." : "Gửi mã khôi phục"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          {/* OTP */}
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
              Mã OTP
            </label>
            <input
              type='text'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
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

          {/* New Password */}
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
              Mật khẩu mới
            </label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
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

          {/* Confirm Password */}
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
              Xác nhận mật khẩu
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 13,
              background: loading ? "#ccc" : "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginTop: 8,
            }}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}

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
