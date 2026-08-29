import React from "react";
import { Calendar, ChevronDown } from "lucide-react";

export default function ProfileForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "420px" }}>
      
      {/* Email Field */}
      <div style={{ position: "relative" }}>
        <div style={{ 
          position: "absolute", 
          top: "8px", 
          left: "16px", 
          fontSize: "12px", 
          fontWeight: 600, 
          color: "#4b5563" 
        }}>
          Email
        </div>
        <input 
          type="email" 
          value="alma.lawson@example.com"
          readOnly
          style={{
            width: "100%",
            padding: "26px 16px 8px",
            borderRadius: "12px",
            border: "1px solid #1a1a1a",
            backgroundColor: "transparent",
            fontSize: "14px",
            color: "#1a1a1a",
            fontWeight: 500,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Password Field */}
      <div style={{ position: "relative" }}>
        <div style={{ 
          position: "absolute", 
          top: "8px", 
          left: "16px", 
          fontSize: "12px", 
          fontWeight: 600, 
          color: "#4b5563" 
        }}>
          Mật khẩu
        </div>
        <input 
          type="password" 
          defaultValue="000000000"
          style={{
            width: "100%",
            padding: "26px 16px 8px",
            borderRadius: "12px",
            border: "1px solid #1a1a1a",
            backgroundColor: "transparent",
            fontSize: "14px",
            color: "#1a1a1a",
            fontWeight: 500,
            outline: "none",
            boxSizing: "border-box",
            letterSpacing: "0.2em"
          }}
        />
      </div>

      {/* Full Name Field */}
      <div style={{ position: "relative" }}>
        <div style={{ 
          position: "absolute", 
          top: "8px", 
          left: "16px", 
          fontSize: "12px", 
          fontWeight: 600, 
          color: "#4b5563" 
        }}>
          Họ và tên
        </div>
        <input 
          type="text" 
          defaultValue="Harleen Quinzel"
          style={{
            width: "100%",
            padding: "26px 16px 8px",
            borderRadius: "12px",
            border: "1px solid #1a1a1a",
            backgroundColor: "transparent",
            fontSize: "14px",
            color: "#1a1a1a",
            fontWeight: 500,
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Two columns for DOB and Gender */}
      <div style={{ display: "flex", gap: "16px" }}>
        
        {/* DOB Field */}
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ 
            position: "absolute", 
            top: "8px", 
            left: "16px", 
            fontSize: "12px", 
            fontWeight: 600, 
            color: "#4b5563" 
          }}>
            Ngày sinh
          </div>
          <input 
            type="text" 
            defaultValue="01/01/1900"
            style={{
              width: "100%",
              padding: "26px 40px 8px 16px",
              borderRadius: "12px",
              border: "1px solid #1a1a1a",
              backgroundColor: "transparent",
              fontSize: "14px",
              color: "#1a1a1a",
              fontWeight: 500,
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          <Calendar size={18} color="#4b5563" style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>

        {/* Gender Field */}
        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ 
            position: "absolute", 
            top: "8px", 
            left: "16px", 
            fontSize: "12px", 
            fontWeight: 600, 
            color: "#4b5563" 
          }}>
            Giới tính
          </div>
          <select 
            defaultValue="Nữ"
            style={{
              width: "100%",
              padding: "26px 40px 8px 16px",
              borderRadius: "12px",
              border: "1px solid #1a1a1a",
              backgroundColor: "transparent",
              fontSize: "14px",
              color: "#1a1a1a",
              fontWeight: 500,
              outline: "none",
              boxSizing: "border-box",
              appearance: "none",
              cursor: "pointer"
            }}
          >
            <option value="Nữ">Nữ</option>
            <option value="Nam">Nam</option>
            <option value="Khác">Khác</option>
          </select>
          <ChevronDown size={18} color="#1a1a1a" style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Confirm Button */}
      <button 
        style={{
          marginTop: "16px",
          backgroundColor: "#2196f3",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "14px 32px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          width: "max-content",
          boxShadow: "0 2px 8px rgba(33, 150, 243, 0.3)"
        }}
      >
        Xác nhận
      </button>

    </div>
  );
}
