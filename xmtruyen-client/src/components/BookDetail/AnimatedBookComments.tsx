import React, { useState, useEffect, useRef } from "react";
import { Star, ThumbsUp, MessageSquare } from "lucide-react";
import { getReviews, createReview } from "../../services/engagementService";

interface AnimatedBookCommentsProps {
  publicationId: string;
}

export default function AnimatedBookComments({ publicationId }: AnimatedBookCommentsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [newCommentId, setNewCommentId] = useState<string | null>(null);
  const [likedAnimation, setLikedAnimation] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver>();

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

  // Stagger reveal khi scroll vào viewport
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('data-comment-id');
                    if (id) {
                        setTimeout(() => {
                            setVisibleIds(prev => new Set([...prev, id]));
                        }, parseInt(entry.target.getAttribute('data-index') || '0') * 80);
                        observerRef.current?.unobserve(entry.target);
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: '50px' }
    );
    return () => observerRef.current?.disconnect();
  }, [reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createReview(publicationId, rating, content);
      setContent("");
      setRating(5);
      await loadReviews();
      
      // Assume the first review is the new one
      if (res && res.data) {
          setNewCommentId(res.data.id || "temp-new");
          setTimeout(() => setNewCommentId(null), 500);
      }
    } catch (err) {
      alert("Vui lòng đăng nhập để đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (commentId: string) => {
    setLikedAnimation(commentId);
    setTimeout(() => setLikedAnimation(null), 600);
    // TODO: Gọi API like
  };

  return (
    <div style={{ marginTop: "40px" }} className="comments-section">
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-color, #1f2937)", marginBottom: "20px" }}>
        Bình luận, đánh giá ({totalCount})
      </h2>
      
      {/* Review Form */}
      <div style={{ 
        backgroundColor: "var(--panel-bg, #ffffff)", 
        borderRadius: "12px", 
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        marginBottom: "20px",
        transition: "all 0.3s ease"
      }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-color, #1f2937)" }}>Đánh giá:</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="hover-scale"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Star size={20} fill={star <= rating ? "#facc15" : "none"} color={star <= rating ? "#facc15" : "var(--border-color, #d1d5db)"} />
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
              minHeight: content ? "100px" : "60px",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #e5e7eb)",
              backgroundColor: "var(--bg-color, #f9fafb)",
              color: "var(--text-color, #1f2937)",
              fontSize: "14px",
              resize: "vertical",
              transition: "min-height 200ms ease, border-color 200ms ease"
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
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {loading ? (
              <span className="animate-pulse">Đang gửi...</span>
            ) : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.map((review, idx) => {
          const isVisible = visibleIds.has(review.id) || review.id === newCommentId;
          const isNew = review.id === newCommentId;
          
          return (
          <div 
            key={review.id} 
            data-comment-id={review.id}
            data-index={idx}
            ref={el => { if (el) observerRef.current?.observe(el); }}
            className={isNew ? "animate-slideInLeft" : ""}
            style={{ 
              backgroundColor: "var(--panel-bg, #ffffff)", 
              borderRadius: "12px", 
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 400ms ease, transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
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
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-color, #1f2937)" }}>
                    {review.user?.username || review.user?.fullName || "Người dùng"}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? "#facc15" : "none"} color={i < review.rating ? "#facc15" : "var(--border-color, #d1d5db)"} />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #9ca3af)" }}>
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-color, #374151)", whiteSpace: "pre-wrap", marginBottom: "12px" }}>
                  {review.content}
                </div>
                
                {/* Micro-interactions */}
                <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                    <button 
                        onClick={() => handleLike(review.id)}
                        style={{ 
                            background: "none", border: "none", cursor: "pointer", 
                            display: "flex", alignItems: "center", gap: "4px",
                            fontSize: "12px", color: "var(--text-muted, #9ca3af)"
                        }}
                    >
                        <div className={likedAnimation === review.id ? "animate-heartBeat" : ""} style={{ display: 'inline-flex', color: likedAnimation === review.id ? "#ef4444" : "inherit" }}>
                            <ThumbsUp size={14} />
                        </div>
                        Thích
                    </button>
                    <button style={{ 
                        background: "none", border: "none", cursor: "pointer", 
                        display: "flex", alignItems: "center", gap: "4px",
                        fontSize: "12px", color: "var(--text-muted, #9ca3af)"
                    }}>
                        <MessageSquare size={14} />
                        Trả lời
                    </button>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
