import React, { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "123456") {
      navigate("/");
    } else {
      alert("Sai email hoặc mật khẩu! (Mẫu: admin@gmail.com / 123456)");
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
          marginBottom: 24,
        }}
      >
        Đăng nhập
      </h1>

      {/* Google */}
      <button
        style={{
          width: "100%",
          padding: 11,
          border: "1.5px solid #ccc",
          borderRadius: 8,
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          color: "#222",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 10,
          fontFamily: "inherit",
        }}
      >
        <svg width='16' height='16' viewBox='0 0 24 24'>
          <path
            fill='#4285F4'
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
          />
          <path
            fill='#34A853'
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
          />
          <path
            fill='#FBBC05'
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
          />
          <path
            fill='#EA4335'
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
          />
        </svg>
        Đăng nhập bằng Google
      </button>

      {/* Zalo */}
      <button
        style={{
          width: "100%",
          padding: 11,
          border: "1.5px solid #ccc",
          borderRadius: 8,
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          color: "#222",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 10,
          fontFamily: "inherit",
        }}
      >
        <div style={{
          width: 18,
          height: 18,
          backgroundColor: "#0068ff",
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          fontSize: 10,
        }}>Z</div>
        Đăng nhập bằng Zalo
      </button>

      {/* Guest */}
      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: 11,
          border: "1.5px solid #ccc",
          borderRadius: 8,
          background: "#fff",
          fontSize: 13,
          fontWeight: 600,
          color: "#222",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 4,
          fontFamily: "inherit",
        }}
      >
        <User size={16} />
        Tiếp tục với tài khoản khách
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "16px 0",
          fontSize: 12,
          color: "#aaa",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
        Or
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
      </div>

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

      {/* Password */}
      <div style={{ position: "relative", marginBottom: 6 }}>
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
          Mật khẩu
        </label>
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "13px 40px 13px 14px",
            border: "1.5px solid #ccc",
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            backgroundColor: "#fff",
            fontFamily: "inherit",
            color: "#222",
          }}
        />
        <button
          onClick={() => setShowPw(!showPw)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#aaa",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>

      {/* Remember + Forgot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "8px 0 18px",
          fontSize: 12,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#555",
            cursor: "pointer",
          }}
        >
          <input
            type='checkbox'
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ accentColor: "#2196f3" }}
          />
          Ghi nhớ đăng nhập
        </label>
        <Link
          to="/forgot-password"
          style={{
            color: "#2196f3",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* Login button */}
      <button
        onClick={handleLogin}
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
        }}
      >
        Đăng nhập
      </button>

      {/* Sign up */}
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#666",
          marginTop: 16,
        }}
      >
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          style={{
            color: "#2196f3",
            fontWeight: 700,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
