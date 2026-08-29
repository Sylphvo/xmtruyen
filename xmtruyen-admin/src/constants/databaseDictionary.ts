export interface ColumnDescription {
  label: string;
  description: string;
  example?: string;
}

export interface TableDescription {
  name: string;
  vietnameseName: string;
  summary: string;
  storageDetails: string;
  columns: Record<string, ColumnDescription>;
}

export const DATABASE_TABLE_DICTIONARY: Record<string, TableDescription> = {
  BookChapters: {
    name: "BookChapters",
    vietnameseName: "Chương truyện chữ",
    summary: "Lưu trữ thông tin và toàn bộ nội dung văn bản từng chương của tiểu thuyết/truyện chữ.",
    storageDetails: "Mỗi bản ghi đại diện cho một chương truyện chữ hoàn chỉnh. Liên kết với bảng Publications thông qua PublicationId, quản lý số thứ tự chương (ChapterNumber), nội dung chữ (Content), cờ kiểm soát VIP (IsLocked), số xu yêu cầu (CoinPrice) và lượt đọc.",
    columns: {
      Id: { label: "Mã chương", description: "Khóa chính UUID duy nhất của chương truyện chữ", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu đến bảng Publications (Bộ truyện)", example: "7c9e6679-7425-40de-944b-e07fc1f90ae7" },
      ChapterNumber: { label: "Số thứ tự chương", description: "Số thứ tự chương (hỗ trợ số thập phân như 1, 2, 2.5)", example: "12" },
      Title: { label: "Tiêu đề chương", description: "Tên hoặc tiêu đề riêng của chương", example: "Chương 12: Đột phá cảnh giới" },
      Content: { label: "Nội dung văn bản", description: "Toàn bộ nội dung chữ của chương truyện để độc giả đọc", example: "Trời đêm nay gió thổi lành lạnh..." },
      IsLocked: { label: "Khóa VIP", description: "True: Chương yêu cầu trả phí/VIP; False: Miễn phí đọc", example: "false" },
      CoinPrice: { label: "Giá Xu mở khóa", description: "Số Xu cần trả để mở khóa chương nếu IsLocked = True", example: "10" },
      ViewCount: { label: "Lượt xem", description: "Tổng số lượt độc giả truy cập đọc chương này", example: "1520" },
      CreatedAt: { label: "Thời điểm tạo", description: "Ngày giờ đăng tải hoặc tạo mới chương truyện", example: "2026-08-01 14:30:00" }
    }
  },

  ComicChapters: {
    name: "ComicChapters",
    vietnameseName: "Chương truyện tranh",
    summary: "Quản lý các tập/chương truyện tranh, đóng vai trò chứa tập hợp các trang ảnh (ComicPages).",
    storageDetails: "Liên kết với bảng Publications. Khác với truyện chữ, bảng này không lưu nội dung văn bản mà liên kết 1-Nhiều với bảng ComicPages để tải danh sách hình ảnh theo thứ tự trang.",
    columns: {
      Id: { label: "Mã chương tranh", description: "Khóa chính UUID duy nhất của chương truyện tranh", example: "a1b2c3d4-..." },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu đến bảng Publications", example: "7c9e6679-..." },
      ChapterNumber: { label: "Số thứ tự chapter", description: "Số tập / chapter của truyện tranh (VD: 10, 10.5)", example: "10" },
      Title: { label: "Tiêu đề chapter", description: "Tên tập truyện tranh (nếu có)", example: "Chap 10: Trận chiến đầu tiên" },
      IsLocked: { label: "Khóa VIP", description: "True: Yêu cầu trả phí hoặc VIP; False: Đọc miễn phí", example: "false" },
      CoinPrice: { label: "Giá Xu mở khóa", description: "Số Xu cần trả để mua chương truyện tranh này", example: "15" },
      ViewCount: { label: "Lượt xem", description: "Số lượt độc giả đọc tập truyện tranh này", example: "3400" },
      CreatedAt: { label: "Ngày tạo", description: "Thời điểm đăng tập truyện tranh lên hệ thống", example: "2026-08-02 09:00:00" }
    }
  },

  ComicPages: {
    name: "ComicPages",
    vietnameseName: "Trang ảnh tranh",
    summary: "Lưu trữ từng trang hình ảnh cụ thể thuộc về một chương truyện tranh.",
    storageDetails: "Mỗi bản ghi lưu URL ảnh CDN/S3 của một trang truyện tranh và số thứ tự trang (PageNumber) để trình đọc hiển thị liên tục theo đúng thứ tự.",
    columns: {
      Id: { label: "Mã trang ảnh", description: "Khóa chính UUID duy nhất của từng trang hình ảnh", example: "b4c5d6e7-..." },
      ComicChapterId: { label: "Mã chapter tranh", description: "Khóa ngoại tham chiếu đến bảng ComicChapters", example: "a1b2c3d4-..." },
      PageNumber: { label: "Số thứ tự trang", description: "Vị trí hiển thị của trang ảnh trong tập (bắt đầu từ 1)", example: "1" },
      ImageUrl: { label: "Đường dẫn ảnh", description: "URL lưu trữ ảnh trang truyện trên máy chủ CDN / Storage", example: "/uploads/comics/chap10/p1.webp" }
    }
  },

  Publications: {
    name: "Publications",
    vietnameseName: "Bộ truyện",
    summary: "Bảng dữ liệu trung tâm lưu trữ toàn bộ tác phẩm truyện tranh và truyện chữ trong hệ sinh thái.",
    storageDetails: "Chứa thông tin tổng quan của từng bộ truyện: tiêu đề, tác giả, ảnh bìa, loại định dạng (FormatType: Text/Comic/Audio), cấp độ truy cập (AccessLevel), điểm đánh giá, số lượt đọc và người sở hữu/đăng tải.",
    columns: {
      Id: { label: "Mã tác phẩm", description: "Khóa chính UUID của bộ truyện", example: "7c9e6679-..." },
      Title: { label: "Tên bộ truyện", description: "Tiêu đề đầy đủ của tác phẩm", example: "Đấu Phá Thương Khung" },
      Slug: { label: "Đường dẫn thân thiện (Slug)", description: "Chuỗi URL SEO không dấu", example: "dau-pha-thuong-khung" },
      FormatType: { label: "Định dạng tác phẩm", description: "1: Sách (Text), 2: Truyện tranh (Comic)", example: "1" },
      AccessLevel: { label: "Cấp độ truy cập", description: "0: Miễn phí (Free), 1: Trả phí theo chương (PayPerChapter), 2: Gói VIP", example: "0" },
      Author: { label: "Tác giả", description: "Tên tác giả gốc hoặc bút danh", example: "Thiên Tằm Thổ Đậu" },
      Description: { label: "Tóm tắt nội dung", description: "Mô tả cốt truyện, giới thiệu tác phẩm", example: "Đây là thế giới thuộc về đấu khí..." },
      CoverImageUrl: { label: "Ảnh bìa", description: "Đường dẫn ảnh đại diện/poster của bộ truyện", example: "/covers/dau-pha.jpg" },
      ViewCount: { label: "Tổng lượt xem", description: "Tổng lượt truy cập đọc tất cả các chương của bộ truyện", example: "128400" },
      AverageRating: { label: "Điểm đánh giá TB", description: "Điểm sao trung bình do độc giả đánh giá (thang điểm 5.0)", example: "4.8" },
      IsRecommended: { label: "Đề cử", description: "True nếu truyện được gắn cờ nổi bật trên trang chủ", example: "true" },
      IsExclusive: { label: "Độc quyền", description: "True nếu truyện là tác phẩm bản quyền độc quyền của Xóm Truyện", example: "false" },
      Status: { label: "Trạng thái truyện", description: "Trạng thái: Active (Hoạt động), Ongoing (Đang ra), Completed (Hoàn thành), Inactive", example: "Active" },
      OwnerId: { label: "Mã người đăng", description: "Khóa ngoại UserId của tác giả / người đăng truyện", example: "e1f2a3b4-..." },
      CreatedBy: { label: "Người tạo", description: "Tên hoặc email của người tạo bản ghi", example: "admin@xmtruyen.com" },
      UpdatedBy: { label: "Người sửa", description: "Tên hoặc email của người cập nhật lần cuối", example: "editor@xmtruyen.com" },
      CreatedAt: { label: "Ngày tạo", description: "Thời điểm đăng tải bộ truyện", example: "2026-07-20 10:00:00" },
      UpdatedAt: { label: "Ngày cập nhật", description: "Thời điểm sửa đổi thông tin hoặc cập nhật chương mới", example: "2026-08-06 18:00:00" }
    }
  },

  Users: {
    name: "Users",
    vietnameseName: "Người dùng",
    summary: "Quản lý thông tin độc giả, tác giả và tài khoản quản trị viên trong toàn bộ hệ thống.",
    storageDetails: "Lưu trữ hồ sơ cá nhân, thông tin xác thực bảo mật (mật khẩu băm BCrypt, OAuth Google/Facebook), số dư Xu thanh toán, gói thành viên VIP hiện tại và giới hạn đọc hàng ngày.",
    columns: {
      Id: { label: "Mã người dùng", description: "Khóa chính UUID duy nhất của tài khoản", example: "e1f2a3b4-..." },
      Email: { label: "Địa chỉ Email", description: "Email đăng nhập và nhận thông báo của tài khoản", example: "reader@gmail.com" },
      PasswordHash: { label: "Mật khẩu mã hóa", description: "Chuỗi hash mật khẩu theo chuẩn BCrypt bảo mật", example: "$2a$11$..." },
      FullName: { label: "Họ và tên", description: "Tên hiển thị công khai của người dùng", example: "Nguyễn Văn Đọc" },
      AvatarUrl: { label: "Ảnh đại diện", description: "Đường dẫn ảnh đại diện avatar", example: "/avatars/user1.png" },
      Provider: { label: "Phương thức đăng nhập", description: "Local, Google, Facebook, Apple", example: "Local" },
      ProviderId: { label: "Mã định danh OAuth", description: "ID trả về từ nhà cung cấp OAuth bên ngoài", example: "null" },
      CoinBalance: { label: "Số dư Xu", description: "Tổng số Xu trong ví dùng để mở khóa chương truyện VIP", example: "250" },
      CurrentPlanId: { label: "Mã gói VIP", description: "Khóa ngoại ID gói thành viên VIP đang kích hoạt", example: "1" },
      PlanExpiredAt: { label: "Hạn dùng gói VIP", description: "Ngày giờ hết hạn gói thành viên VIP", example: "2026-09-01 23:59:59" },
      TotalGuestReads: { label: "Lượt đọc ẩn danh", description: "Số chương đã đọc khi chưa đăng nhập", example: "5" },
      DailyReadCount: { label: "Lượt đọc trong ngày", description: "Đếm số chương đọc trong ngày hiện tại để kiểm soát giới hạn", example: "18" },
      LastReadDate: { label: "Ngày đọc gần nhất", description: "Ngày cuối cùng phát sinh lượt đọc (dùng reset DailyReadCount)", example: "2026-08-06" },
      IsActive: { label: "Kích hoạt", description: "True: Tài khoản hoạt động bình thường; False: Bị khóa", example: "true" },
      CreatedAt: { label: "Ngày đăng ký", description: "Thời điểm tài khoản được tạo", example: "2026-07-15 08:00:00" }
    }
  },

  Categories: {
    name: "Categories",
    vietnameseName: "Thể loại",
    summary: "Danh mục các thể loại văn học và truyện tranh như Tiên Hiệp, Huyền Huyễn, Ngôn Tình, Trinh Thám...",
    storageDetails: "Lưu danh sách danh mục thể loại để phân nhóm và phục vụ tính năng lọc, tìm kiếm truyện theo sở thích.",
    columns: {
      Id: { label: "Mã thể loại", description: "Khóa chính định danh thể loại", example: "1" },
      Name: { label: "Tên thể loại", description: "Tên gọi của thể loại", example: "Tiên Hiệp" },
      Description: { label: "Mô tả thể loại", description: "Diễn giải đặc điểm của thể loại truyện này", example: "Truyện tu chân, luyện đan, phi thăng..." }
    }
  },

  Topics: {
    name: "Topics",
    vietnameseName: "Chủ đề",
    summary: "Phân loại truyện theo các chủ đề sự kiện, bộ sưu tập chuyên đề hoặc nhóm độc giả mục tiêu.",
    storageDetails: "Dùng để gom nhóm các tác phẩm vào các chuyên đề hiển thị trên Banner hoặc mục gợi ý.",
    columns: {
      Id: { label: "Mã chủ đề", description: "Khóa chính định danh chủ đề", example: "1" },
      Name: { label: "Tên chủ đề", description: "Tiêu đề của chủ đề tuyển tập", example: "Truyện Đề Cử Tháng 8" },
      Description: { label: "Mô tả chủ đề", description: "Mô tả tiêu chí tuyển chọn của chủ đề", example: "Top truyện được yêu thích nhất..." }
    }
  },

  PublicationCategories: {
    name: "PublicationCategories",
    vietnameseName: "Liên kết Thể loại",
    summary: "Bảng cầu nối liên kết mối quan hệ nhiều-nhiều giữa Tác phẩm (Publications) và Thể loại (Categories).",
    storageDetails: "Một bộ truyện có thể thuộc nhiều thể loại khác nhau (ví dụ vừa Tiên Hiệp vừa Trọng Sinh). Bảng này lưu cặp ID tương ứng.",
    columns: {
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu bảng Publications", example: "7c9e6679-..." },
      CategoryId: { label: "Mã thể loại", description: "Khóa ngoại tham chiếu bảng Categories", example: "1" }
    }
  },

  PublicationTopics: {
    name: "PublicationTopics",
    vietnameseName: "Liên kết Chủ đề",
    summary: "Bảng cầu nối liên kết mối quan hệ nhiều-nhiều giữa Tác phẩm (Publications) và Chủ đề (Topics).",
    storageDetails: "Cho phép gán một bộ truyện vào một hoặc nhiều chuyên đề/bộ sưu tập nổi bật.",
    columns: {
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu bảng Publications", example: "7c9e6679-..." },
      TopicId: { label: "Mã chủ đề", description: "Khóa ngoại tham chiếu bảng Topics", example: "2" }
    }
  },

  Bookmarks: {
    name: "Bookmarks",
    vietnameseName: "Dấu trang",
    summary: "Lưu lại vị trí đánh dấu trang cụ thể mà độc giả lưu lại để đọc tiếp sau này.",
    storageDetails: "Lưu liên kết giữa người dùng (UserId), chương truyện (ChapterId) và loại chương (ChapterType: Book/Comic).",
    columns: {
      Id: { label: "Mã dấu trang", description: "Khóa chính UUID của bản ghi đánh dấu", example: "c1d2e3f4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId của độc giả", example: "e1f2a3b4-..." },
      ChapterId: { label: "Mã chương", description: "ID chương truyện đang được bookmark", example: "3fa85f64-..." },
      ChapterType: { label: "Loại chương", description: "0: Chương truyện chữ, 1: Chương truyện tranh", example: "0" },
      CreatedAt: { label: "Thời điểm lưu", description: "Ngày giờ độc giả bấm đánh dấu trang", example: "2026-08-05 21:00:00" }
    }
  },

  ReadingHistories: {
    name: "ReadingHistories",
    vietnameseName: "Lịch sử đọc",
    summary: "Theo dõi tiến độ đọc truyện chi tiết theo thời gian thực của độc giả.",
    storageDetails: "Ghi nhận chương truyện đọc gần nhất, vị trí dòng/trang cuộn và thời điểm đọc lần cuối để tính năng 'Đọc tiếp' tự động mở đúng vị trí.",
    columns: {
      Id: { label: "Mã lịch sử", description: "Khóa chính UUID của bản ghi lịch sử đọc", example: "d1e2f3a4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId của người đọc", example: "e1f2a3b4-..." },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu bộ truyện", example: "7c9e6679-..." },
      LastChapterId: { label: "Mã chương gần nhất", description: "Chương mới nhất mà độc giả đang đọc dở", example: "3fa85f64-..." },
      LastReadAt: { label: "Thời điểm đọc gần nhất", description: "Thời gian cập nhật tiến độ đọc cuối cùng", example: "2026-08-06 22:15:00" }
    }
  },

  UserFavorites: {
    name: "UserFavorites",
    vietnameseName: "Tủ sách yêu thích",
    summary: "Danh sách các bộ truyện mà người dùng đã bấm 'Yêu thích' / Thêm vào tủ sách cá nhân.",
    storageDetails: "Lưu cặp UserId và PublicationId cùng ngày tạo để hiển thị trong màn hình 'Tủ Sách Của Tôi'.",
    columns: {
      Id: { label: "Mã bản ghi", description: "Khóa chính UUID của mục yêu thích", example: "f1a2b3c4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId của độc giả", example: "e1f2a3b4-..." },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại tham chiếu đến bộ truyện yêu thích", example: "7c9e6679-..." },
      CreatedAt: { label: "Ngày yêu thích", description: "Thời điểm người dùng thêm truyện vào tủ sách", example: "2026-07-28 15:45:00" }
    }
  },

  UserPurchasedChapters: {
    name: "UserPurchasedChapters",
    vietnameseName: "Chương đã mua",
    summary: "Ghi nhận quyền sở hữu vĩnh viễn các chương truyện VIP đã được người dùng thanh toán bằng Xu.",
    storageDetails: "Khi độc giả thanh toán mở khóa chương, bản ghi sẽ được lưu tại đây. API đọc truyện kiểm tra bảng này để cấp quyền đọc ngay cả khi hết hạn VIP.",
    columns: {
      Id: { label: "Mã giao dịch mua", description: "Khóa chính UUID bản ghi mua chương", example: "e9f8a7b6-..." },
      UserId: { label: "Mã người mua", description: "Khóa ngoại UserId của độc giả đã mua chương", example: "e1f2a3b4-..." },
      ChapterId: { label: "Mã chương", description: "Khóa ngoại ID của chương truyện đã mua", example: "3fa85f64-..." },
      CoinsPaid: { label: "Số Xu đã thanh toán", description: "Lượng Xu bị trừ tại thời điểm giao dịch", example: "10" },
      PurchasedAt: { label: "Thời điểm mua", description: "Ngày giờ thực hiện mua thành công", example: "2026-08-04 19:20:00" }
    }
  },

  UserPublications: {
    name: "UserPublications",
    vietnameseName: "Truyện tác giả",
    summary: "Quản lý phân quyền chỉnh sửa và xuất bản giữa Tác giả / Nhóm dịch và Bộ truyện.",
    storageDetails: "Lưu quyền sở hữu, vai trò quản lý (Owner/Editor/Translator) đối với từng bộ truyện.",
    columns: {
      Id: { label: "Mã bản ghi", description: "Khóa chính UUID", example: "a9b8c7d6-..." },
      UserId: { label: "Mã tác giả/dịch giả", description: "Khóa ngoại UserId", example: "e1f2a3b4-..." },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại bộ truyện", example: "7c9e6679-..." },
      Role: { label: "Vai trò", description: "Vai trò: Creator, Editor, Translator", example: "Creator" }
    }
  },

  Notes: {
    name: "Notes",
    vietnameseName: "Ghi chú",
    summary: "Lưu các trích dẫn, ghi chú hoặc lời bình riêng tư của độc giả gắn với từng đoạn văn trong chương.",
    storageDetails: "Hỗ trợ tính năng highlight trích dẫn và ghi chú cá nhân của người đọc.",
    columns: {
      Id: { label: "Mã ghi chú", description: "Khóa chính UUID của ghi chú", example: "n1n2n3n4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId của tác giả ghi chú", example: "e1f2a3b4-..." },
      ChapterId: { label: "Mã chương", description: "Khóa ngoại ID chương chứa đoạn trích", example: "3fa85f64-..." },
      Content: { label: "Nội dung ghi chú", description: "Lời bình hoặc suy nghĩ của độc giả", example: "Đoạn này tác giả miêu tả tâm lý rất hay" },
      CreatedAt: { label: "Ngày ghi chú", description: "Thời điểm tạo ghi chú", example: "2026-08-03 20:10:00" }
    }
  },

  Reviews: {
    name: "Reviews",
    vietnameseName: "Đánh giá",
    summary: "Lưu điểm số chấm sao (1-5 sao) và bình luận đánh giá công khai của độc giả cho bộ truyện.",
    storageDetails: "Mỗi độc giả có thể đánh giá một bộ truyện kèm bình luận. Dữ liệu này dùng để tính điểm trung bình AverageRating cho truyện.",
    columns: {
      Id: { label: "Mã đánh giá", description: "Khóa chính UUID của bản ghi đánh giá", example: "r1r2r3r4-..." },
      UserId: { label: "Mã người đánh giá", description: "Khóa ngoại UserId của độc giả", example: "e1f2a3b4-..." },
      PublicationId: { label: "Mã tác phẩm", description: "Khóa ngoại bộ truyện được đánh giá", example: "7c9e6679-..." },
      Rating: { label: "Điểm sao", description: "Điểm số từ 1 đến 5 sao", example: "5" },
      Comment: { label: "Nội dung bình luận", description: "Nhận xét chi tiết về tác phẩm", example: "Truyện cực phẩm, cốt truyện logic, đáng đọc!" },
      CreatedAt: { label: "Ngày đánh giá", description: "Thời điểm đăng đánh giá", example: "2026-08-01 12:00:00" }
    }
  },

  Transactions: {
    name: "Transactions",
    vietnameseName: "Giao dịch",
    summary: "Nhật ký biến động số dư tài chính: nạp xu, mua gói VIP, trừ xu mở khóa chương.",
    storageDetails: "Bảo đảm tính minh bạch tài chính. Mỗi giao dịch lưu loại giao dịch (Deposit, ChapterPurchase, Subscription), số tiền VNĐ, lượng xu và trạng thái.",
    columns: {
      Id: { label: "Mã giao dịch", description: "Khóa chính UUID của giao dịch", example: "t1t2t3t4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId thực hiện giao dịch", example: "e1f2a3b4-..." },
      Amount: { label: "Số tiền / Xu", description: "Giá trị giao dịch (Số xu hoặc số tiền VNĐ)", example: "50000" },
      Type: { label: "Loại giao dịch", description: "Deposit (Nạp tiền), BuyChapter (Mua chương), BuyVIP (Mua gói VIP)", example: "Deposit" },
      Status: { label: "Trạng thái", description: "Success (Thành công), Pending (Chờ xử lý), Failed (Thất bại)", example: "Success" },
      CreatedAt: { label: "Ngày giao dịch", description: "Thời điểm phát sinh giao dịch", example: "2026-08-02 16:00:00" }
    }
  },

  SubscriptionPlans: {
    name: "SubscriptionPlans",
    vietnameseName: "Gói VIP",
    summary: "Bảng cấu hình các gói thành viên VIP của hệ sinh thái Xóm Truyện.",
    storageDetails: "Định nghĩa giá tiền, thời hạn ngày sử dụng và các quyền lợi đặc biệt (đọc không giới hạn chương VIP, không quảng cáo).",
    columns: {
      Id: { label: "Mã gói", description: "Khóa chính số nguyên của gói VIP", example: "1" },
      Name: { label: "Tên gói hội viên", description: "Tên thương mại của gói", example: "Gói VIP Tháng (30 Ngày)" },
      Price: { label: "Giá tiền (VNĐ)", description: "Đơn giá mua gói thành viên", example: "49000" },
      DurationDays: { label: "Thời hạn (Ngày)", description: "Số ngày có hiệu lực của gói VIP", example: "30" },
      Description: { label: "Quyền lợi gói", description: "Chi tiết các đặc quyền đi kèm", example: "Đọc không giới hạn toàn bộ truyện VIP, tải ảnh HD" }
    }
  },

  UserTokens: {
    name: "UserTokens",
    vietnameseName: "Phiên đăng nhập",
    summary: "Quản lý Refresh Token và phiên đăng nhập bảo mật của người dùng trên các thiết bị.",
    storageDetails: "Lưu trữ Token đã cấp phát, ngày hết hạn và cờ thu hồi để hỗ trợ cơ chế xác thực JWT bảo mật không cần đăng nhập lại liên tục.",
    columns: {
      Id: { label: "Mã Token", description: "Khóa chính UUID", example: "u1u2u3u4-..." },
      UserId: { label: "Mã người dùng", description: "Khóa ngoại UserId sở hữu token", example: "e1f2a3b4-..." },
      Token: { label: "Chuỗi Token", description: "Chuỗi Refresh Token ngẫu nhiên bảo mật", example: "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4..." },
      ExpiresAt: { label: "Thời điểm hết hạn", description: "Ngày giờ Token hết hiệu lực", example: "2026-08-20 00:00:00" },
      IsRevoked: { label: "Đã thu hồi", description: "True nếu người dùng đã đăng xuất hoặc token bị vô hiệu hóa", example: "false" }
    }
  }
};

/**
 * Lấy thông tin mô tả chi tiết của bảng
 */
export const getTableInfo = (tableName?: string): TableDescription => {
  if (!tableName) {
    return {
      name: "Unknown",
      vietnameseName: "Bảng dữ liệu",
      summary: "Bảng lưu trữ thông tin trong hệ thống CSDL Xóm Truyện.",
      storageDetails: "Quản lý các trường dữ liệu và bản ghi tương ứng.",
      columns: {}
    };
  }

  const found = DATABASE_TABLE_DICTIONARY[tableName];
  if (found) return found;

  return {
    name: tableName,
    vietnameseName: `Bảng ${tableName}`,
    summary: `Quản lý và lưu trữ dữ liệu thực thể ${tableName} trong hệ sinh thái Xóm Truyện.`,
    storageDetails: `Bảng này quản lý các bản ghi và mối quan hệ dữ liệu liên quan đến ${tableName}.`,
    columns: {}
  };
};

/**
 * Lấy mô tả chi tiết của một cột trong bảng
 */
export const getColumnInfo = (tableName?: string, columnName?: string): ColumnDescription => {
  if (!tableName || !columnName) {
    return {
      label: columnName || "Trường dữ liệu",
      description: "Dữ liệu của bản ghi trong bảng"
    };
  }

  const tableInfo = DATABASE_TABLE_DICTIONARY[tableName];
  if (tableInfo && tableInfo.columns && tableInfo.columns[columnName]) {
    return tableInfo.columns[columnName];
  }

  // Fallback quy tắc đặt tên tự động thông minh
  const colLower = columnName.toLowerCase();
  if (colLower === "id") {
    return { label: "Khóa chính (PK)", description: "Mã định danh duy nhất của bản ghi trong bảng" };
  }
  if (colLower.endsWith("id")) {
    const ref = columnName.substring(0, columnName.length - 2);
    return { label: `Mã ${ref} (FK)`, description: `Khóa ngoại liên kết tới bảng ${ref}` };
  }
  if (colLower.startsWith("is") || colLower.startsWith("has")) {
    return { label: "Trạng thái (Bool)", description: "Cờ bật/tắt logic (True hoặc False)" };
  }
  if (colLower.includes("date") || colLower.endsWith("at")) {
    return { label: "Thời gian", description: "Thời điểm ghi nhận sự kiện dữ liệu" };
  }
  if (colLower.includes("price") || colLower.includes("coin") || colLower.includes("amount")) {
    return { label: "Giá trị / Số tiền", description: "Số lượng tiền hoặc xu giao dịch" };
  }
  if (colLower.includes("count") || colLower.includes("number")) {
    return { label: "Số lượng / Số thứ tự", description: "Chỉ số số học hoặc số đếm thống kê" };
  }

  return {
    label: columnName,
    description: `Trường dữ liệu ${columnName} của bảng ${tableName}`
  };
};
