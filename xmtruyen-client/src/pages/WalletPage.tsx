import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PACKAGES = [
  { id: "pack_50", name: "Gói Starter", coins: 50, price: 10000, bonus: "" },
  { id: "pack_120", name: "Gói Tiết kiệm", coins: 120, price: 20000, bonus: "+20 xu free" },
  { id: "pack_350", name: "Gói Hot", coins: 350, price: 50000, bonus: "+50 xu free" },
  { id: "pack_800", name: "Gói Đại gia", coins: 800, price: 100000, bonus: "+150 xu free" },
];

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<string>("pack_120");
  const [paymentMethod, setPaymentMethod] = useState<string>("Manual");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await fetch("http://localhost:5172/api/payment/wallet", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5172/api/payment/top-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId: selectedPack,
          paymentMethod: paymentMethod,
          returnUrl: window.location.origin + "/wallet"
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          toast.success(data.message || "Tạo đơn nạp thành công!");
          // For manual top-up, show instructions
          if (paymentMethod === "Manual") {
            alert("Vui lòng chuyển khoản với nội dung: Nạp xu Xmtruyen - Mã đơn: " + data.orderId + ". Admin sẽ duyệt sau khi nhận được.");
          }
        }
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div style={{ color: "white", padding: 20 }}>Đang tải...</div>;

  return (
    <div style={{ padding: "30px", color: "#e0e0e0", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ color: "#00d4ff", marginBottom: 20 }}>Ví Xu của bạn</h1>
      
      {/* Thông tin số dư */}
      <div style={{ background: "#1a1a2e", padding: "20px", borderRadius: "12px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: 5 }}>Số dư hiện tại</p>
          <h2 style={{ fontSize: "36px", color: "#ffd93d", margin: 0 }}>{wallet?.coinBalance || 0} <span style={{ fontSize: "18px", color: "#ccc" }}>Xu</span></h2>
        </div>
        <div>
          <Link to="/subscription" style={{ background: "#ff6b9d", color: "white", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
            Mua Gói VIP
          </Link>
        </div>
      </div>

      <h2 style={{ color: "white", marginBottom: 15 }}>Chọn Gói Nạp</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        {PACKAGES.map(pack => (
          <div
            key={pack.id}
            onClick={() => setSelectedPack(pack.id)}
            style={{
              background: selectedPack === pack.id ? "#2a2a4a" : "#1a1a2e",
              border: `2px solid ${selectedPack === pack.id ? "#00d4ff" : "transparent"}`,
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>{pack.name}</h3>
            <div style={{ fontSize: "24px", color: "#ffd93d", fontWeight: "bold", marginBottom: "5px" }}>{pack.coins} Xu</div>
            <div style={{ color: "#888", marginBottom: pack.bonus ? "5px" : 0 }}>{pack.price.toLocaleString()} VNĐ</div>
            {pack.bonus && <div style={{ color: "#7ee787", fontSize: "12px", fontWeight: "bold" }}>{pack.bonus}</div>}
          </div>
        ))}
      </div>

      <h2 style={{ color: "white", marginBottom: 15 }}>Phương Thức Thanh Toán</h2>
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <button 
          onClick={() => setPaymentMethod("Manual")}
          style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${paymentMethod === "Manual" ? "#00d4ff" : "#333"}`, background: paymentMethod === "Manual" ? "#1a1a2e" : "transparent", color: "white", cursor: "pointer" }}>
          Chuyển khoản thủ công
        </button>
        <button 
          onClick={() => setPaymentMethod("MoMo")}
          style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${paymentMethod === "MoMo" ? "#00d4ff" : "#333"}`, background: paymentMethod === "MoMo" ? "#1a1a2e" : "transparent", color: "white", cursor: "pointer" }}>
          Ví MoMo
        </button>
        <button 
          onClick={() => setPaymentMethod("VNPay")}
          style={{ padding: "10px 20px", borderRadius: "8px", border: `1px solid ${paymentMethod === "VNPay" ? "#00d4ff" : "#333"}`, background: paymentMethod === "VNPay" ? "#1a1a2e" : "transparent", color: "white", cursor: "pointer" }}>
          VNPay
        </button>
      </div>

      <button 
        onClick={handleTopUp}
        disabled={isProcessing}
        style={{ background: "#00d4ff", color: "#000", padding: "15px 30px", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", border: "none", cursor: isProcessing ? "not-allowed" : "pointer", width: "100%", opacity: isProcessing ? 0.7 : 1 }}>
        {isProcessing ? "Đang xử lý..." : `Thanh toán ${PACKAGES.find(p => p.id === selectedPack)?.price.toLocaleString()} VNĐ`}
      </button>
    </div>
  );
}
