import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      
      const [plansRes, walletRes] = await Promise.all([
        fetch("http://localhost:5172/api/plans"),
        token ? fetch("http://localhost:5172/api/payment/wallet", { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve(null)
      ]);

      if (plansRes.ok) {
        setPlans(await plansRes.json());
      }
      
      if (walletRes && walletRes.ok) {
        setWallet(await walletRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number, price: number) => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập");
        return;
      }
      
      // Calculate coin price (1 coin = 1000 VND)
      const coinPrice = price / 1000;
      
      if (wallet && wallet.coinBalance < coinPrice) {
        toast.error("Không đủ xu. Vui lòng nạp thêm!");
        return;
      }
      
      const res = await fetch("http://localhost:5172/api/payment/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: planId,
          paymentMethod: "Coin",
          returnUrl: window.location.origin + "/subscription"
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đăng ký thành công!");
        fetchData(); // Refresh wallet
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
    <div style={{ padding: "30px", color: "#e0e0e0", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h1 style={{ color: "#ff6b9d", margin: "0 0 10px 0" }}>Nâng Cấp Tài Khoản</h1>
          <p style={{ color: "#888", margin: 0 }}>Trải nghiệm đọc truyện không giới hạn với XomTruyen VIP</p>
        </div>
        {wallet && (
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 5px 0", color: "#888" }}>Số dư hiện tại:</p>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#ffd93d" }}>
              {wallet.coinBalance} Xu 
              <Link to="/wallet" style={{ fontSize: "12px", background: "#333", color: "white", padding: "4px 8px", borderRadius: "4px", marginLeft: 10, textDecoration: "none" }}>Nạp thêm</Link>
            </div>
            {wallet.currentPlanId && (
              <div style={{ marginTop: 5, color: "#7ee787", fontSize: "14px" }}>
                Gói hiện tại: {wallet.planName}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: "#1a1a2e",
            borderRadius: "16px",
            padding: "30px",
            position: "relative",
            overflow: "hidden",
            border: plan.name === "VIP" ? "2px solid #ff6b9d" : "1px solid #333"
          }}>
            {plan.name === "VIP" && (
              <div style={{ background: "#ff6b9d", color: "white", padding: "5px 30px", position: "absolute", top: 20, right: -30, transform: "rotate(45deg)", fontSize: "12px", fontWeight: "bold" }}>
                PHỔ BIẾN
              </div>
            )}
            
            <h2 style={{ margin: "0 0 15px 0", color: plan.name === "VIP" ? "#ff6b9d" : "white", fontSize: "24px" }}>{plan.name}</h2>
            
            <div style={{ marginBottom: "25px" }}>
              <span style={{ fontSize: "36px", fontWeight: "bold", color: "white" }}>{plan.price === 0 ? "Miễn phí" : (plan.price / 1000) + " Xu"}</span>
              {plan.price > 0 && <span style={{ color: "#888" }}>/{plan.durationDays} ngày</span>}
            </div>
            
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", color: "#ccc" }}>
              <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                <span style={{ color: "#7ee787", marginRight: "10px" }}>✓</span> {plan.isUnlimited ? "Đọc không giới hạn" : `Giới hạn ${plan.maxChaptersPerDay} chương/ngày`}
              </li>
              <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                <span style={{ color: plan.removeAds ? "#7ee787" : "#ff4444", marginRight: "10px" }}>{plan.removeAds ? "✓" : "✗"}</span> {plan.removeAds ? "Không quảng cáo" : "Có quảng cáo"}
              </li>
              <li style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                <span style={{ color: plan.name === "VIP" ? "#7ee787" : "#ff4444", marginRight: "10px" }}>{plan.name === "VIP" ? "✓" : "✗"}</span> Ưu tiên đọc truyện mới
              </li>
            </ul>

            <button 
              disabled={isProcessing || wallet?.currentPlanId === plan.id}
              onClick={() => handleSubscribe(plan.id, plan.price)}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "8px",
                border: "none",
                background: wallet?.currentPlanId === plan.id ? "#333" : (plan.name === "VIP" ? "#ff6b9d" : "#333"),
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: (isProcessing || wallet?.currentPlanId === plan.id) ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}>
              {wallet?.currentPlanId === plan.id ? "Đang sử dụng" : (plan.price === 0 ? "Mặc định" : (isProcessing ? "Đang xử lý..." : "Đăng ký ngay"))}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
