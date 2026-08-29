import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getReviews, createReview } from "../../services/engagementService";

interface BookCommentsProps {
  publicationId: string;
}

export default function BookComments({ publicationId }: BookCommentsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await getReviews(publicationId);
      if (data.success) {
        setReviews(data.data);
        setTotalCount(data.totalCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (publicationId) {
      loadReviews();
    }
  }, [publicationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createReview(publicationId, rating, content);
      setContent("");
      setRating(5);
      await loadReviews();
    } catch (err) {
      alert("Vui lòng đăng nhập để đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", marginBottom: "20px" }}>
        Bình luận, đánh giá ({totalCount})
      </h2>
      
      {/* Review Form */}
      <div style={{ 
        backgroundColor: "#ffffff", 
        borderRadius: "12px", 
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        marginBottom: "20px"
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Đánh giá:</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Star size={20} fill={star <= rating ? "#facc15" : "none"} color={star <= rating ? "#facc15" : "#d1d5db"} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết đánh giá của bạn..."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              resize: "vertical"
            }}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              alignSelf: "flex-end",
              padding: "8px 24px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.map((review) => (
          <div key={review.id} style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "12px", 
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e74c3c",
                flexShrink: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {review.user?.avatarUrl ? (
                  <img src={review.user.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "#c0392b", position: "relative" }}>
                     <div style={{ position: "absolute", bottom: "-5px", left: "50%", transform: "translateX(-50%)", width: "24px", height: "24px", backgroundColor: "#111", borderRadius: "50%" }}></div>
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>
                    {review.user?.username || review.user?.fullName || "Người dùng"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? "#facc15" : "none"} color={i < review.rating ? "#facc15" : "#d1d5db"} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563" }}>
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "#374151", whiteSpace: "pre-wrap" }}>
                  {review.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
