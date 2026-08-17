import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, BookOpen, PlayCircle, CheckCircle } from "lucide-react";
import Skeleton from "../components/common/Skeleton";
import Footer from "../components/Layout/Footer";
import axios from "axios";

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationSeconds: number;
  isFreePreview: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  previewVideoUrl: string;
  price: number;
  discountPrice?: number;
  level: string;
  totalLessons: number;
  totalDurationMinutes: number;
  enrollmentCount: number;
  averageRating: number;
  instructor: {
    id: string;
    fullName: string;
    avatarUrl: string;
  };
  sections: Section[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false); // Should check API in real app

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      // Dummy fetch, replace with actual API
      // const response = await axios.get(`http://localhost:5172/api/course/${id}`);
      // setCourse(response.data);
      
      // Dummy data
      setTimeout(() => {
        setCourse({
          id: id || "1",
          title: "Khóa học Vẽ Truyện Tranh Cơ Bản",
          description: "Khóa học này sẽ hướng dẫn bạn cách vẽ truyện tranh từ những nét cơ bản nhất. Bạn sẽ học về giải phẫu học, phối cảnh, cách thiết kế nhân vật và cách kể chuyện bằng hình ảnh.",
          thumbnailUrl: "mock-course-1",
          previewVideoUrl: "mock-video-url",
          price: 500000,
          discountPrice: 299000,
          level: "Beginner",
          totalLessons: 20,
          totalDurationMinutes: 1200,
          enrollmentCount: 1500,
          averageRating: 4.8,
          instructor: {
            id: "i1",
            fullName: "Nguyễn Văn A",
            avatarUrl: "mock-avatar",
          },
          sections: [
            {
              id: "s1",
              title: "Chương 1: Giới thiệu chung",
              lessons: [
                { id: "l1", title: "Giới thiệu khóa học", type: "Video", durationSeconds: 300, isFreePreview: true },
                { id: "l2", title: "Chuẩn bị dụng cụ", type: "Video", durationSeconds: 600, isFreePreview: true },
              ]
            },
            {
              id: "s2",
              title: "Chương 2: Vẽ nhân vật",
              lessons: [
                { id: "l3", title: "Tỷ lệ khuôn mặt", type: "Video", durationSeconds: 1200, isFreePreview: false },
                { id: "l4", title: "Vẽ mắt, mũi, miệng", type: "Video", durationSeconds: 1500, isFreePreview: false },
              ]
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      // await axios.post(`/api/enrollment/course/${id}`);
      setIsEnrolled(true);
      alert("Đăng ký thành công!");
    } catch (error) {
      alert("Lỗi khi đăng ký khóa học.");
    }
  };

  if (loading) {
    return (
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "32px 60px", flex: 1 }}>
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ flex: 2 }}>
              <Skeleton type="text" width="80%" height="40px" />
              <Skeleton type="text" width="60%" height="20px" />
              <Skeleton type="rectangular" width="100%" height="300px" borderRadius="12px" style={{ marginTop: "24px" }} />
              <Skeleton type="rectangular" width="100%" height="200px" style={{ marginTop: "24px" }} />
            </div>
            <div style={{ flex: 1 }}>
              <Skeleton type="rectangular" width="100%" height="400px" borderRadius="12px" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!course) return <div>Khóa học không tồn tại</div>;

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: "#1a1a2e", color: "white", padding: "40px 60px" }}>
        <div style={{ display: "flex", gap: "40px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ flex: 2 }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>{course.title}</h1>
            <p style={{ fontSize: "16px", color: "#ccc", marginBottom: "24px", lineHeight: "1.6" }}>{course.description}</p>
            
            <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#aaa", marginBottom: "24px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={16} fill="#facc15" color="#facc15" /> 
                <span style={{ color: "#facc15", fontWeight: "bold" }}>{course.averageRating}</span> 
                ({course.enrollmentCount} học viên)
              </span>
              <span>• Giảng viên: <span style={{ color: "white" }}>{course.instructor.fullName}</span></span>
              <span>• Cập nhật lần cuối: 10/2026</span>
            </div>
          </div>
          
          <div style={{ flex: 1, position: "relative" }}>
            {/* Floating Card */}
            <div style={{ 
              position: "absolute", 
              top: "0", 
              right: "0", 
              width: "100%", 
              backgroundColor: "var(--bg-secondary, #fff)", 
              borderRadius: "12px", 
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
              overflow: "hidden",
              border: "1px solid var(--border-color, #eee)"
            }}>
              <div style={{ height: "200px", backgroundColor: "#ddd", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlayCircle size={64} color="white" opacity={0.8} cursor="pointer" />
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  {course.discountPrice ? (
                    <>
                      <span style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent-color, #ff6b9d)", marginRight: "12px" }}>
                        {course.discountPrice.toLocaleString()} xu
                      </span>
                      <span style={{ fontSize: "16px", color: "#999", textDecoration: "line-through" }}>
                        {course.price.toLocaleString()} xu
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: "32px", fontWeight: "bold", color: "var(--accent-color, #ff6b9d)" }}>
                      {course.price.toLocaleString()} xu
                    </span>
                  )}
                </div>
                
                {isEnrolled ? (
                  <Link to={`/course/${course.id}/learn`} style={{ textDecoration: "none" }}>
                    <button style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "var(--accent-color, #ff6b9d)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}>
                      Vào học ngay
                    </button>
                  </Link>
                ) : (
                  <button onClick={handleEnroll} style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "var(--accent-color, #ff6b9d)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}>
                    Mua khóa học
                  </button>
                )}
                
                <div style={{ marginTop: "24px", fontSize: "14px", color: "#666" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "12px" }}>Khóa học này bao gồm:</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "12px" }}><Clock size={16} /> {Math.floor(course.totalDurationMinutes / 60)} giờ video học liệu</li>
                    <li style={{ display: "flex", alignItems: "center", gap: "12px" }}><BookOpen size={16} /> {course.totalLessons} bài học</li>
                    <li style={{ display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle size={16} /> Truy cập trọn đời</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "40px 60px", flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ width: "65%" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>Nội dung khóa học</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666", marginBottom: "16px" }}>
            <span>{course.sections.length} phần • {course.totalLessons} bài học • Thời lượng {Math.floor(course.totalDurationMinutes / 60)}h {course.totalDurationMinutes % 60}m</span>
          </div>

          <div style={{ border: "1px solid var(--border-color, #ddd)", borderRadius: "8px", overflow: "hidden" }}>
            {course.sections.map((section, idx) => (
              <div key={section.id} style={{ borderBottom: idx < course.sections.length - 1 ? "1px solid var(--border-color, #ddd)" : "none" }}>
                <div style={{ backgroundColor: "var(--bg-secondary, #f9fafb)", padding: "16px 24px", fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>{section.title}</span>
                  <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666" }}>{section.lessons.length} bài học</span>
                </div>
                <div>
                  {section.lessons.map(lesson => (
                    <div key={lesson.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px 24px", borderTop: "1px solid #eee", fontSize: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <PlayCircle size={16} color={lesson.isFreePreview ? "var(--accent-color, #ff6b9d)" : "#999"} />
                        <span style={{ color: lesson.isFreePreview ? "var(--accent-color, #ff6b9d)" : "inherit", cursor: lesson.isFreePreview ? "pointer" : "default" }}>
                          {lesson.title}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "16px", color: "#888" }}>
                        {lesson.isFreePreview && <span style={{ textDecoration: "underline", cursor: "pointer" }}>Học thử</span>}
                        <span>{Math.floor(lesson.durationSeconds / 60)}:{String(lesson.durationSeconds % 60).padStart(2, '0')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
