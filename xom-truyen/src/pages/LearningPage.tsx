import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, PlayCircle, CheckCircle, Lock } from "lucide-react";
import axios from "axios";

interface Lesson {
  id: string;
  title: string;
  type: string;
  durationSeconds: number;
  isFreePreview: boolean;
  videoUrl?: string;
  isCompleted?: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function LearningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    // Dummy fetch
    setTimeout(() => {
      const mockSections = [
        {
          id: "s1",
          title: "Chương 1: Giới thiệu chung",
          lessons: [
            { id: "l1", title: "Giới thiệu khóa học", type: "Video", durationSeconds: 300, isFreePreview: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isCompleted: true },
            { id: "l2", title: "Chuẩn bị dụng cụ", type: "Video", durationSeconds: 600, isFreePreview: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isCompleted: false },
          ]
        },
        {
          id: "s2",
          title: "Chương 2: Vẽ nhân vật",
          lessons: [
            { id: "l3", title: "Tỷ lệ khuôn mặt", type: "Video", durationSeconds: 1200, isFreePreview: false, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isCompleted: false },
            { id: "l4", title: "Vẽ mắt, mũi, miệng", type: "Video", durationSeconds: 1500, isFreePreview: false, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", isCompleted: false },
          ]
        }
      ];
      setSections(mockSections);
      setActiveLesson(mockSections[0].lessons[0]);
      setLoading(false);
    }, 500);
  };

  const handleLessonEnd = () => {
    if (activeLesson) {
      setActiveLesson(prev => prev ? { ...prev, isCompleted: true } : prev);
      // Optional: Auto play next lesson
    }
  };

  if (loading) return <div style={{ padding: "40px", color: "white" }}>Đang tải bài học...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#0f0f1a", color: "#e0e0e0" }}>
      {/* Main Content Area (Video Player) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid #333" }}>
        {/* Topbar */}
        <div style={{ height: "60px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", padding: "0 20px" }}>
          <button onClick={() => navigate(`/course/${id}`)} style={{
            display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "16px"
          }}>
            <ChevronLeft size={20} /> Quay lại khóa học
          </button>
        </div>

        {/* Video Player */}
        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "1000px", aspectRatio: "16/9", backgroundColor: "black", borderRadius: "12px", overflow: "hidden" }}>
            {activeLesson?.videoUrl ? (
              <video 
                src={activeLesson.videoUrl} 
                controls 
                style={{ width: "100%", height: "100%" }}
                onEnded={handleLessonEnd}
                autoPlay
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={48} color="#666" />
                <span style={{ marginLeft: "16px", fontSize: "18px", color: "#666" }}>Bài học này đã bị khóa</span>
              </div>
            )}
          </div>
          
          <div style={{ width: "100%", maxWidth: "1000px", marginTop: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>{activeLesson?.title}</h2>
          </div>
        </div>
      </div>

      {/* Sidebar (Lesson List) */}
      <div style={{ width: "350px", display: "flex", flexDirection: "column", backgroundColor: "#1a1a2e" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid #333", fontSize: "18px", fontWeight: "bold" }}>
          Nội dung khóa học
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {sections.map(section => (
            <div key={section.id}>
              <div style={{ padding: "16px 20px", backgroundColor: "#12121f", borderBottom: "1px solid #333", fontWeight: "bold", fontSize: "14px" }}>
                {section.title}
              </div>
              <div>
                {section.lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    onClick={() => setActiveLesson(lesson)}
                    style={{ 
                      padding: "16px 20px", 
                      borderBottom: "1px solid #333", 
                      display: "flex", 
                      alignItems: "flex-start", 
                      gap: "12px",
                      cursor: "pointer",
                      backgroundColor: activeLesson?.id === lesson.id ? "#2a2a3e" : "transparent",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{ marginTop: "2px" }}>
                      {lesson.isCompleted ? (
                        <CheckCircle size={18} color="#22c55e" />
                      ) : lesson.isFreePreview || true ? (
                        <PlayCircle size={18} color={activeLesson?.id === lesson.id ? "var(--accent-color, #ff6b9d)" : "#888"} />
                      ) : (
                        <Lock size={18} color="#555" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", color: activeLesson?.id === lesson.id ? "white" : "#ccc", marginBottom: "4px" }}>
                        {lesson.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {Math.floor(lesson.durationSeconds / 60)}:{String(lesson.durationSeconds % 60).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
