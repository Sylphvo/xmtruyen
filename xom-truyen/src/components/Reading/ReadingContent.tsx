import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReadingContentProps {
  chapterNumber: number;
  chapterTitle: string;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function ReadingContent({
  chapterNumber,
  chapterTitle,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage
}: ReadingContentProps) {
  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      padding: "0 80px",
      position: "relative",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    }}>
      
      {/* Navigation Arrows */}
      <button 
        onClick={onPrevPage}
        style={{
          position: "absolute",
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <button 
        onClick={onNextPage}
        style={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <ChevronRight size={32} strokeWidth={2.5} />
      </button>

      {/* Chapter Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px 0" }}>
          Chương {chapterNumber}
        </h2>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          {chapterTitle}
        </h1>
      </div>

      {/* Two Column Text */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "60px",
        fontSize: "15px",
        lineHeight: 1.8,
        color: "#374151"
      }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ margin: 0 }}>
            Chung Thu Yếu muốn đính chính với cậu ta, nhưng mấp máy môi lại không biết nói gì, đành giả vờ như không nghe thấy.
          </p>
          <p style={{ margin: 0 }}>
            Tống Cạnh Hàm nhắm mắt lại nhưng không hề ngủ, khóe môi hơi cong lên, trên mặt lộ vẻ thỏa mãn.
          </p>
          <p style={{ margin: 0 }}>
            Cậu ta mệt thật, lúc đầu chỉ muốn dựa vào, nhưng cứ dựa như vậy rồi ngủ thiếp đi.
          </p>
          <p style={{ margin: 0 }}>
            Chung Thu Yếu giữ nguyên tư thế, cả người không thoải mái, vai cũng hơi mỏi vì bị cậu ta đè.
          </p>
          <p style={{ margin: 0 }}>
            Nhưng nghe thấy tiếng thở đều đều của cậu ta, biết cậu ta đã ngủ, cô ta chịu đựng không cử động.
          </p>
          <p style={{ margin: 0 }}>
            Xe dừng ở ngoài khu chung cư của Chung Thu Yếu, cô ta lay vai Tống Cạnh Hàm gọi: "Tống Cạnh Hàm."
          </p>
          <p style={{ margin: 0 }}>
            Tống Cạnh Hàm nheo mắt lại rồi mở mắt ra, ngồi thẳng người nhìn ra bên ngoài: "Tới nhanh vậy sao?"
          </p>
          <p style={{ margin: 0 }}>
            Toàn bộ cánh tay của Chung Thu Yếu tê dại, cô ta cử động vài cái, lẩm bẩm: "Nặng chết đi được."
          </p>
          <p style={{ margin: 0 }}>
            Tống Cạnh Hàm thấy cô ta ôm cánh tay, biết mình đè làm cánh tay cô ta tê: "Sao không đánh thức em?"
          </p>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ margin: 0 }}>
            "Thấy em mệt mỏi nên không gọi." Cánh tay tê liệt của Chung Thu Yếu có thể cử động, cô xách túi chuẩn bị xuống xe.
          </p>
          <p style={{ margin: 0 }}>
            Tống Cạnh Hàm bật cười. Nếu là trước đây tay mà tê, Chung Thu Yếu nhất định sẽ tát cho cậu ta tỉnh hoặc đẩy đầu cậu ta ra, nào có thể quan tâm cậu ta có mệt hay không.
          </p>
          <p style={{ margin: 0 }}>
            Thái độ của cô ta đối với cậu ta đang dần thay đổi, đây là một dấu hiệu tốt.
          </p>
          <p style={{ margin: 0, textAlign: "center", color: "#9ca3af" }}>
            *
          </p>
          <p style={{ margin: 0 }}>
            Sau bữa tối, Tần Huy Nguyệt bật tivi xem show mà Lâm Thành ghi hình ngày hôm qua.
          </p>
          <p style={{ margin: 0 }}>
            Xem xong vẫn còn sớm, cô ta xem thêm hai tập phim truyền hình, sau đó thấy thời gian cũng khá muộn nên cô ta tắt tivi định lên lầu.
          </p>
          <p style={{ margin: 0 }}>
            Lúc đi đến đầu cầu thang, cô ta cảm thấy hơi khát nước nên quay người đi về phía máy lọc nước. Khi đang uống nước thì cửa phòng khách mở ra, Lâm Thành từ bên ngoài đi vào.
          </p>
          <p style={{ margin: 0 }}>
            Máy lọc nước đặt ở trong góc, Lâm Thành không nhìn thấy cô ta nên tiện tay đóng cửa đi về phía sofa.
          </p>
          <p style={{ margin: 0 }}>
            Anh ta có vẻ rất mệt mỏi, đi tới ngồi phịch xuống sofa, khẽ nhắm mắt lại, một tay day mi tâm.
          </p>
        </div>
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        textAlign: "center", 
        padding: "24px 0", 
        fontSize: "14px", 
        fontWeight: 500,
        color: "#4b5563",
        marginTop: "auto"
      }}>
        {currentPage}/{totalPages}
      </div>
    </div>
  );
}
