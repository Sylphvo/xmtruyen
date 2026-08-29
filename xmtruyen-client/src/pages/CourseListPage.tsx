import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, BookOpen, GraduationCap } from "lucide-react";
import Skeleton from "../components/common/Skeleton";
import Footer from "../components/Layout/Footer";
import axios from "axios";

interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  price: number;
  discountPrice?: number;
  level: string;
  totalLessons: number;
  totalDurationMinutes: number;
  averageRating: number;
  instructorName: string;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Khóa học - Xmtruyen";
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Dummy fetch, replace with actual API
      // const response = await axios.get("http://localhost:5172/api/course");
      // setCourses(response.data.data);
      
      // Dummy data for now
      setTimeout(() => {
        setCourses([
          {
            id: "1",
            title: "Khóa học Vẽ Truyện Tranh Cơ Bản",
            thumbnailUrl: "mock-course-1",
            price: 500000,
            discountPrice: 299000,
            level: "Beginner",
            totalLessons: 20,
            totalDurationMinutes: 1200,
            averageRating: 4.8,
            instructorName: "Nguyễn Văn A"
          },
          {
            id: "2",
            title: "Khóa học Viết Kịch Bản Chuyên Nghiệp",
            thumbnailUrl: "mock-course-2",
            price: 800000,
            level: "Intermediate",
            totalLessons: 35,
            totalDurationMinutes: 2400,
            averageRating: 4.9,
            instructorName: "Trần Thị B"
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setLoading(false);
    }
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "32px 60px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <GraduationCap size={28} color="var(--accent-color, #ff6b9d)" />
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Khám Phá Khóa Học</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--bg-secondary, #fff)", border: "1px solid var(--border-color, #eaeaea)" }}>
                <Skeleton type="rectangular" width="100%" height="160px" borderRadius={0} />
                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Skeleton type="text" width="100%" height="20px" />
                  <Skeleton type="text" width="60%" height="14px" />
                  <Skeleton type="text" width="80%" height="14px" />
                </div>
              </div>
            ))
          ) : (
            courses.map(course => (
              <Link to={`/course/${course.id}`} key={course.id} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  backgroundColor: "var(--bg-secondary, #fff)", 
                  border: "1px solid var(--border-color, #eaeaea)",
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ height: "160px", backgroundColor: "#ddd", position: "relative" }}>
                    {/* Placeholder for thumbnail */}
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                      Image: {course.thumbnailUrl}
                    </div>
                  </div>
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 8px 0", color: "var(--text-h, #1a1a1a)" }}>
                      {course.title}
                    </h3>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                      Giảng viên: {course.instructorName}
                    </div>
                    <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={14} /> {Math.floor(course.totalDurationMinutes / 60)}h {course.totalDurationMinutes % 60}m
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <BookOpen size={14} /> {course.totalLessons} bài học
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Star size={14} fill="#facc15" color="#facc15" /> {course.averageRating}
                      </span>
                    </div>
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: "8px" }}>
                      {course.discountPrice ? (
                        <>
                          <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-color, #ff6b9d)" }}>
                            {course.discountPrice.toLocaleString()} {course.discountPrice > 0 ? "xu" : ""}
                          </span>
                          <span style={{ fontSize: "14px", color: "#999", textDecoration: "line-through" }}>
                            {course.price.toLocaleString()} xu
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent-color, #ff6b9d)" }}>
                          {course.price > 0 ? `${course.price.toLocaleString()} xu` : "Miễn phí"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
