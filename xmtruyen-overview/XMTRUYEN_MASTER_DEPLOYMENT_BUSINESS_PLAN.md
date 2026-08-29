# Xóm Truyện - Master Deployment, Growth và Business Plan

## 1. Mục tiêu

Tài liệu này tổng hợp kế hoạch triển khai Xóm Truyện từ lúc chưa có người dùng đến khi có lượng truy cập lớn, bao gồm:

- Deploy website, API, database và worker.
- Trải nghiệm người dùng và chất lượng nội dung.
- Tăng trưởng user qua website, iOS, Android, YouTube, TikTok và Facebook.
- Kiếm tiền từ nhiều nguồn.
- Theo dõi server, lỗi, fraud, hành vi đọc và cơ hội tối ưu.
- Chi phí VPS, storage, CDN, thanh toán, marketing và nội dung.
- Mốc đánh giá sau 3 tháng, 6 tháng và 1 năm.
- Cách xử lý nếu doanh thu hoặc user thấp hơn kế hoạch.
- Module tạo video từ sách/truyện chữ để làm nội dung truyền thông.

Các con số trong tài liệu là **kịch bản lập kế hoạch**, không phải dự báo chắc chắn. Doanh thu thực tế phụ thuộc nội dung có bản quyền, thị trường, chất lượng sản phẩm, tỷ lệ chuyển đổi, quốc gia người dùng và chính sách từng nền tảng.

## 2. Tài liệu nguồn đã tổng hợp

- `DEPLOYMENT_SCALING_PLAN.md`: lộ trình VPS, storage, monitoring và scale.
- `MONETIZATION_PLAN.md`: quảng cáo, VIP, xu, audio, tác giả và affiliate.
- `DASHBOARD_SYSTEM_MONITORING_PLAN.md`: server metrics, API, database, worker, user activity, fraud và bug risk.
- `SIGNALR_REALTIME_SETTINGS_PLAN.md`: SignalR, polling fallback, job progress, alerts và realtime monitoring.
- `ADMIN_MENU_GROUPING_PLAN.md`: gom nhóm Admin theo nghiệp vụ.
- `DOCS_IMPLEMENTATION_TASKS.md`: tab Docs theo từng màn hình quản lý.
- `xmtruyen.API/business_logic.md`: quyền đọc, quảng cáo, VIP, xu và chapter.
- `xmtruyen.API/handle_bulk_upload_chapters.md`: upload chapter hàng loạt.
- `xmtruyen.API/handle_book.md`: xử lý PDF/EPUB và storage.
- `xmtruyen-admin/src/pages/BookVideoDashboard.tsx`: quản lý video truyện chữ.
- `xmtruyen-admin/src/pages/ComicVideoDashboard.tsx`: quản lý video truyện tranh.
- `xmtruyen.API/Services/BookVideo`: tạo nội dung/video từ sách chữ.
- `xmtruyen.API/Services/VideoConvert`: worker chuyển đổi video.

## 3. Chiến lược tổng thể

```text
Nội dung hợp pháp
  -> Trải nghiệm đọc tốt
  -> User quay lại
  -> Theo dõi truyện
  -> Gói VIP/xu/audio
  -> Nội dung video trên social
  -> Có thêm traffic
  -> Tăng doanh thu
  -> Tái đầu tư vào nội dung và hạ tầng
```

Ưu tiên theo thứ tự:

1. Quyền sử dụng nội dung.
2. Đọc truyện nhanh, ổn định, dễ dùng.
3. Analytics và monitoring.
4. Tăng nội dung có chất lượng.
5. Marketing organic bằng video.
6. Monetization nhẹ.
7. Paid marketing sau khi biết funnel có hiệu quả.
8. Scale hạ tầng theo số liệu.

## 4. Kiến trúc deploy theo giai đoạn

### 4.1. Giai đoạn development

Có thể chạy local, chưa cần VPS.

```text
Local:
- Admin React/Vite
- Client React/Vite
- .NET API
- PostgreSQL
- Worker nhẹ
```

Dùng demo mode và seed data để phát triển giao diện. Không dùng dữ liệu thật hoặc mở database trực tiếp ra Internet.

### 4.2. Giai đoạn production đầu tiên: 0-100 user

Khuyến nghị VPS SSD 2:

- 2 CPU.
- 4 GB RAM.
- 40 GB SSD.

Có thể chạy chung:

- Nginx.
- Frontend Admin.
- Frontend Client.
- .NET API.
- PostgreSQL.
- Worker nhẹ.

File PDF, ảnh chapter, audio và video nên lưu ở object storage, không lưu lâu dài trên VPS.

### 4.3. Giai đoạn 100-500 user

Dùng VPS SSD 3 hoặc SSD 4:

- 4 CPU.
- 6-8 GB RAM.
- CDN cho file tĩnh và ảnh.
- Redis cho cache/rate limiting/queue nếu cần.

Ưu tiên tách worker trước khi mua VPS quá lớn nếu CPU tăng do PDF, OCR, ZIP, audio hoặc video.

### 4.4. Giai đoạn 500-2.000 user

Tách thành:

```text
VPS Web:
- Nginx
- Frontend
- API

VPS Database:
- PostgreSQL
- Backup

VPS Worker:
- Import
- PDF/EPUB
- ZIP/CBZ
- Audio/video

Redis:
- Queue
- Cache
- Rate limiting

Object Storage + CDN:
- Ảnh
- PDF
- Audio
- Video
```

### 4.5. Trên 2.000 user

Chỉ mở rộng khi monitoring chứng minh cần:

- Load balancer.
- Nhiều API instance.
- Redis backplane cho SignalR.
- Database scaling/read replica.
- Worker autoscaling.
- CDN bắt buộc.
- Monitoring 24/7.

Chỉ tổng số tài khoản không đủ để quyết định scale. Cần nhìn concurrent readers, requests/giây, p95 latency và queue depth.

## 5. Mốc triển khai từ ngày đầu

### Trước ngày deploy

- [ ] Xác nhận quyền sử dụng nội dung.
- [ ] Có domain và DNS.
- [ ] Chuẩn bị VPS nhỏ hoặc local staging.
- [ ] Cài Nginx, .NET runtime và PostgreSQL.
- [ ] Cấu hình HTTPS, firewall và SSH bảo mật.
- [ ] Cấu hình object storage.
- [ ] Cấu hình database backup.
- [ ] Tạo dữ liệu mẫu bằng seed/CSV.
- [ ] Chạy smoke test login, home, search, đọc text và đọc comic.
- [ ] Kiểm tra payment ở sandbox nếu đã tích hợp.
- [ ] Cấu hình error logging và uptime monitoring.

### Ngày deploy

- [ ] Chạy migration database.
- [ ] Deploy API.
- [ ] Deploy frontend web.
- [ ] Kiểm tra CORS, SSL và cache.
- [ ] Kiểm tra API health.
- [ ] Kiểm tra upload và đọc chapter.
- [ ] Kiểm tra backup đầu tiên.
- [ ] Kiểm tra log không lộ secret.
- [ ] Mời nhóm nhỏ dùng thử.
- [ ] Ghi baseline latency, error rate và số người online.

### 7 ngày đầu

- [ ] Theo dõi lỗi hàng ngày.
- [ ] Ghi nhận feedback user.
- [ ] Đo funnel từ landing đến chapter đầu tiên.
- [ ] Sửa lỗi chặn việc đọc trước khi thêm tính năng mới.
- [ ] Chưa chạy quảng cáo trả phí lớn.
- [ ] Tạo nội dung social đều đặn.

## 6. Trải nghiệm người dùng cần đạt

### Người dùng mới

- Mở trang nhanh.
- Không bắt đăng ký trước khi đọc thử.
- Search dễ hiểu.
- Có 10-20 chapter đầu hoặc một phần nội dung miễn phí.
- Hiển thị rõ chapter free/VIP.
- Không popup quảng cáo liên tục.
- Có thể tiếp tục đọc từ vị trí cũ.

### Người dùng quay lại

- Lịch sử đọc chính xác.
- Bookmark và follow truyện.
- Thông báo khi có chapter mới.
- Gợi ý dựa trên lịch sử đọc nhưng không xâm phạm riêng tư.
- Đồng bộ web, iOS và Android.

### Người dùng trả phí

- Quyền VIP/xu được cập nhật ngay sau thanh toán xác nhận.
- Không trừ xu hai lần.
- Có lịch sử giao dịch.
- Có quy trình hoàn tiền.
- Không mất quyền đọc khi reconnect.
- Hỗ trợ rõ ràng khi giao dịch lỗi.

### Người đọc comic

- Ảnh tải lazy-load.
- CDN/object storage.
- Giữ đúng thứ tự trang.
- Có placeholder ổn định.
- Không để API server chịu toàn bộ bandwidth ảnh.

## 7. Các nguồn doanh thu

### 7.1. VIP/subscription

Giá thử nghiệm:

- Basic: 29.000đ/tháng.
- VIP: 59.000đ/tháng.
- Premium: 99.000đ/tháng.

Quyền lợi:

- Ít hoặc không quảng cáo.
- Đọc chapter sớm.
- Chapter VIP.
- Audio.
- Song ngữ.
- Tải offline nếu pháp lý và kỹ thuật cho phép.

### 7.2. Xu/chapter trả phí

Ví dụ:

```text
10.000đ  = 100 xu
50.000đ  = 550 xu
100.000đ = 1.200 xu
```

Cần payment webhook, idempotency, transaction history và hoàn tiền.

### 7.3. Quảng cáo website/app

Nguồn doanh thu có thể gồm:

- Banner.
- Native ad.
- Rewarded ad.
- Video ad.
- Quảng cáo theo impression.
- Quảng cáo theo click nếu network hỗ trợ.

Không tự click quảng cáo, không khuyến khích user click quảng cáo, không dùng traffic bot. Vi phạm có thể khiến tài khoản quảng cáo bị khóa.

### 7.4. Audio và nội dung Premium

- Audio chapter.
- Giọng đọc chất lượng cao.
- Dịch song ngữ.
- Từ điển nâng cao.
- Nội dung độc quyền.
- Đọc sớm.

### 7.5. Hợp tác tác giả

Khi có nội dung hợp pháp và traffic ổn định:

```text
Tác giả: 70%
Nền tảng: 30%
```

Tỷ lệ thực tế cần ghi trong hợp đồng và tính sau phí thanh toán, thuế và chi phí liên quan.

### 7.6. Affiliate và đối tác

- Nhà sách.
- Sách giấy.
- Thiết bị đọc sách.
- Khóa học ngoại ngữ.
- Dịch vụ audiobook.
- Hosting và công cụ cho tác giả.

### 7.7. Doanh thu từ video/social

Có thể đến từ:

- YouTube Partner Program khi đủ điều kiện.
- Brand sponsorship.
- Affiliate link.
- Đưa traffic về web/app.
- Quảng bá truyện/tác giả có hợp đồng.
- Bán gói nội dung hoặc dịch vụ cho tác giả.

Không nên xem doanh thu YouTube/TikTok/Facebook là chắc chắn. Mỗi nền tảng có điều kiện bật kiếm tiền, thị trường và chính sách riêng.

## 8. Website, iOS, Android và social channel

### 8.1. Website

Website là nơi:

- SEO.
- Đọc truyện đầy đủ.
- Đăng ký, VIP, xu và payment.
- Landing page từ social.
- Analytics chi tiết.

KPI cần đo:

- Unique visitors.
- Chapter starts.
- Reading completion.
- Signup conversion.
- Returning user rate.
- VIP conversion.
- Revenue per active user.

### 8.2. Android

Ưu tiên triển khai sớm vì chi phí thử nghiệm và phân phối thường dễ hơn iOS.

KPI:

- Install.
- First open.
- Account registration.
- Chapter start.
- Day 1/7/30 retention.
- Crash-free sessions.
- In-app purchase conversion.
- Uninstall rate.

### 8.3. iOS

Triển khai sau khi web/mobile flow ổn định và đã có dữ liệu product-market fit.

KPI:

- App Store impressions.
- Install.
- Activation.
- Reading sessions.
- Retention.
- Crash-free users.
- Subscription conversion.
- Refund rate.

Cần tuân thủ quy định thanh toán của App Store/Google Play. Không né cơ chế billing của nền tảng.

### 8.4. YouTube

Nội dung phù hợp:

- Tóm tắt có quyền sử dụng.
- Kể chuyện ngắn.
- Giới thiệu thế giới/truyện.
- Video storytelling từ module sách.
- Hướng dẫn đọc.
- Review tác phẩm hợp pháp.

KPI:

- Impressions.
- CTR thumbnail.
- Average view duration.
- Retention 30 giây đầu.
- Subscribers.
- Click từ description/pinned comment.
- Revenue per 1.000 views khi đủ điều kiện.

### 8.5. TikTok

Nội dung phù hợp:

- Clip 15-60 giây.
- Hook từ một tình tiết được phép sử dụng.
- Nhân vật, quote, lore.
- Teaser video.
- Series nhiều phần.
- CTA về website/app.

KPI:

- Views.
- 2-second/6-second hold rate.
- Completion rate.
- Profile visits.
- Link clicks.
- Followers.
- App install attribution.

### 8.6. Facebook

Nội dung phù hợp:

- Reels.
- Bài giới thiệu truyện.
- Group/community.
- Livestream hoặc premiere.
- Link chapter mới.
- Quảng bá tác giả.

KPI:

- Reach.
- Engagement.
- Reel views.
- Link clicks.
- Group members.
- Website sessions.
- Signup conversion.

## 9. Cách tính click, quảng cáo và doanh thu theo kênh

Không có một mức tiền cố định cho mỗi click. Giá phụ thuộc network, quốc gia, loại quảng cáo, thiết bị, mùa quảng cáo và chất lượng traffic.

Dùng công thức:

```text
Ad Revenue = Impressions / 1000 * eCPM
```

```text
Click Revenue = Valid Clicks * CPC
```

```text
Channel Revenue = Ad Revenue + Affiliate Revenue + Sponsorship + Subscription Attribution
```

Bảng KPI kế hoạch dùng để đo, không phải cam kết:

| Kênh | Mục tiêu click ra web/app | Tỷ lệ click tham chiếu để test | Doanh thu cần đo |
|---|---:|---:|---|
| Website | Đo theo session và chapter | 1-5% trên CTA phù hợp | Ads, VIP, xu, affiliate |
| Android | Đo install-to-read và purchase | 2-8% từ campaign tốt | Ads app, IAP, VIP/xu |
| iOS | Đo install-to-read và purchase | 2-8% từ campaign tốt | Ads app, subscription/IAP |
| YouTube | Đo description/pinned link | 0,5-3% | YPP, sponsor, affiliate, web conversion |
| TikTok | Đo profile/link click | 0,5-2% | Creator/sponsor, affiliate, web conversion |
| Facebook | Đo link click và group conversion | 0,5-3% | Ads, sponsor, web conversion |

Chỉ dùng số liệu sau khi có tối thiểu vài nghìn impressions hoặc sessions. Mẫu quá nhỏ dễ dẫn đến quyết định sai.

### Theo dõi attribution

- Dùng UTM cho từng channel/campaign.
- App dùng App Links/Universal Links và attribution phù hợp.
- Tách organic, paid, referral và direct.
- Không đếm duplicate click.
- Không dùng bot hoặc traffic incentivized trái chính sách.

## 10. Kịch bản tài chính 3 tháng, 6 tháng và 1 năm

### 10.1. Giả định

Đây là base scenario để lập kế hoạch:

- Tháng 1-3: sản phẩm mới, organic là chính.
- Tỷ lệ user trả phí thử nghiệm: 1-3% MAU.
- Giá VIP trung bình thực nhận: 40.000-60.000đ/user/tháng trước các chi phí liên quan.
- Quảng cáo chỉ bắt đầu khi UX đọc ổn và traffic hợp lệ.
- Doanh thu social chưa tính là chắc chắn khi chưa đủ điều kiện monetization.
- Tác giả/bản quyền được tách riêng khỏi doanh thu nền tảng.

### 10.2. Sau 3 tháng

Mục tiêu thực tế:

- 100-500 MAU.
- 20-100 user quay lại mỗi tuần.
- 0-15 user trả phí.
- 1-3 series video/tuần.
- Website có analytics cơ bản.
- Android có thể ở beta.
- Chưa cần iOS nếu chưa đủ nguồn lực.

Kịch bản doanh thu gộp/tháng:

| Nguồn | Thận trọng | Cơ sở |
|---|---:|---:|
| VIP/xu | 0-600.000đ | 500.000-2.000.000đ |
| Quảng cáo website/app | 0-300.000đ | 100.000-800.000đ |
| Affiliate | 0-200.000đ | 100.000-500.000đ |
| Video/sponsor | 0đ | 0-1.000.000đ |
| Tổng | 0-1.100.000đ | 700.000-4.300.000đ |

Mục tiêu chính ở mốc này là chứng minh user quay lại, không phải lợi nhuận.

### 10.3. Sau 6 tháng

Mục tiêu thực tế:

- 500-5.000 MAU.
- 100-800 user quay lại hàng tuần.
- 10-150 user trả phí.
- Có thư viện video đều đặn.
- Có Android production nếu crash-free ổn.
- Bắt đầu thử iOS nếu funnel mobile tốt.
- Có ít nhất một nguồn traffic social hiệu quả.

Kịch bản doanh thu gộp/tháng:

| Nguồn | Thận trọng | Cơ sở |
|---|---:|---:|
| VIP/xu | 500.000-3.000.000đ | 3.000.000-12.000.000đ |
| Quảng cáo | 200.000-1.500.000đ | 1.000.000-5.000.000đ |
| Affiliate | 100.000-800.000đ | 500.000-2.000.000đ |
| Audio/Premium | 0-1.000.000đ | 500.000-4.000.000đ |
| Video/sponsor | 0-2.000.000đ | 1.000.000-8.000.000đ |
| Tổng | 800.000-8.300.000đ | 6.000.000-31.000.000đ |

### 10.4. Sau 1 năm

Mục tiêu thực tế:

- 5.000-50.000 MAU tùy chất lượng nội dung và marketing.
- Có user trả phí ổn định.
- Có ít nhất một series/truyện thu hút.
- Có web, Android và cân nhắc iOS.
- Có monitoring và backup production.
- Có quy trình hợp tác tác giả.
- Worker xử lý media tách khỏi API nếu cần.

Kịch bản doanh thu gộp/tháng:

| Nguồn | Thận trọng | Cơ sở |
|---|---:|---:|
| VIP/xu | 3.000.000-15.000.000đ | 15.000.000-80.000.000đ |
| Quảng cáo | 1.000.000-8.000.000đ | 5.000.000-30.000.000đ |
| Affiliate | 500.000-3.000.000đ | 2.000.000-10.000.000đ |
| Audio/Premium | 500.000-5.000.000đ | 3.000.000-20.000.000đ |
| Sponsor/video | 1.000.000-10.000.000đ | 5.000.000-40.000.000đ |
| Tác giả/licensing | 0-5.000.000đ | 5.000.000-50.000.000đ |
| Tổng | 6.000.000-46.000.000đ | 35.000.000-230.000.000đ |

Đây là doanh thu gộp tham khảo. Không phải lợi nhuận. Cần trừ chi phí nội dung, payment fee, thuế, server, storage, marketing và phần chia tác giả.

## 11. Chi phí cần dự trù

### Chi phí cố định

- VPS.
- Domain.
- Email transactional.
- Database backup.
- Object storage.
- CDN.
- Monitoring/logging.
- App Store/Google Play developer account.
- Công cụ analytics hoặc error tracking.

### Chi phí biến đổi

- Băng thông.
- Storage theo GB.
- Xử lý PDF/EPUB/OCR.
- Audio generation.
- Video rendering.
- Payment fee.
- SMS/email.
- Phí bản quyền.
- Chia doanh thu tác giả.
- Quảng cáo trả phí.
- Thuê voice talent/editor/designer.

### Ngân sách khởi đầu tham khảo

| Hạng mục | Mức tiết kiệm/tháng | Mức có dự phòng/tháng |
|---|---:|---:|
| VPS/API/DB | 200.000-800.000đ | 800.000-2.500.000đ |
| Storage/CDN/backup | 100.000-700.000đ | 700.000-3.000.000đ |
| Monitoring/email/tools | 0-500.000đ | 500.000-2.000.000đ |
| Nội dung/video | 0-2.000.000đ | 2.000.000-10.000.000đ |
| Paid marketing | 0-3.000.000đ | 3.000.000-20.000.000đ |
| Tổng | 300.000-7.000.000đ | 7.000.000-37.500.000đ |

Các mức trên cần kiểm tra theo nhà cung cấp, khu vực, thuế và usage thực tế.

## 12. Module tạo video từ sách/truyện chữ

Source hiện có các module liên quan:

- `AdminBookVideoController`.
- `AdminComicVideoController`.
- `BookVideoComposeService`.
- `VideoConvertBackgroundWorker`.
- `BookVideoDashboard`.
- `ComicVideoDashboard`.

### Mục đích

Tạo nội dung truyền thông từ nội dung có quyền sử dụng:

- Video giới thiệu truyện.
- Video kể lại một đoạn ngắn.
- Video nhân vật.
- Video quote/lore.
- Teaser chapter mới.
- Video dọc cho TikTok/Reels/Shorts.
- Video ngang cho YouTube.

### Luồng đề xuất

```text
Chọn sách/chapter được phép dùng
  -> Chọn đoạn nội dung
  -> Tạo scene/segment
  -> Chọn voice/audio
  -> Tạo hình nền hoặc hình minh họa
  -> Compose video
  -> Render worker
  -> Preview
  -> Admin duyệt quyền và chất lượng
  -> Export dọc/ngang
  -> Publish social
  -> Gắn UTM
```

### Không tự động publish ngay

Mỗi video phải có bước review:

- Kiểm tra quyền nội dung.
- Kiểm tra lỗi text/voice/subtitle.
- Kiểm tra hình ảnh và nhạc.
- Kiểm tra watermark/brand.
- Kiểm tra tỷ lệ khung hình.
- Kiểm tra claim bản quyền.
- Kiểm tra CTA và link.

### Preset đề xuất

```text
TikTok/Reels/Shorts:
- 1080x1920
- 15-60 giây
- Hook trong 2 giây đầu
- Subtitle rõ trên mobile

YouTube:
- 1920x1080 hoặc 1080x1920
- 30 giây-5 phút tùy format
- Thumbnail và description có UTM
```

### KPI video

- Hook retention 2 giây.
- Retention 30 giây.
- Completion rate.
- Profile visit.
- Link click.
- Signup từ video.
- Chapter start từ video.
- VIP/xu conversion từ campaign.
- Chi phí render trên mỗi video.

Chỉ scale video pipeline nếu video tạo được traffic hoặc conversion tốt hơn chi phí render và công sức sản xuất.

## 13. Monitoring và quyết định tối ưu/scale

Dashboard cần hiển thị:

- CPU/RAM/Disk/network.
- API requests/giây.
- API p50/p95/p99.
- HTTP 4xx/5xx.
- Database connections.
- Slow query/deadlock.
- Queue depth.
- Worker retry/failure.
- Storage/CDN bandwidth.
- Concurrent readers.
- Reading duration.
- Error fingerprint.
- Fraud watch list.
- Feature usage.
- SignalR connection/reconnect.

### Ngưỡng khởi đầu

| Metric | Cảnh báo | Hành động |
|---|---:|---|
| CPU | > 65% trong 15 phút | Xác định process, tối ưu query/worker |
| RAM | > 70% | Kiểm tra leak, giới hạn worker |
| Disk | > 70% | Dọn file tạm, chuyển object storage |
| API p95 | > 500 ms | Trace endpoint và database |
| API p99 | > 1.000 ms | Ưu tiên xử lý hoặc scale |
| HTTP 5xx | > 1% | Mở incident và xem error fingerprint |
| DB connection | > 70% | Kiểm tra pool/query, cân nhắc tách DB |
| Queue depth | > 20 | Tối ưu hoặc tăng worker |
| CDN cache hit | < 80% | Kiểm tra cache headers và asset delivery |

Không nâng VPS trước khi kiểm tra CDN, query, worker và storage.

## 14. Nếu sau 3 tháng không có doanh thu

Không vội tăng server hoặc tăng quảng cáo. Kiểm tra theo thứ tự:

1. Có user truy cập không?
2. User có đọc hết chapter đầu không?
3. User có quay lại sau 1/7/30 ngày không?
4. Nội dung có đủ hấp dẫn và hợp pháp không?
5. Search và recommendation có đưa đúng truyện không?
6. Paywall có xuất hiện quá sớm không?
7. Payment flow có gây lỗi không?
8. Social video có CTA và UTM không?
9. User rời đi ở bước nào?
10. Chi phí đang vượt doanh thu ở khoản nào?

Giải pháp:

- Tập trung 1-2 nhóm nội dung thay vì dàn trải.
- Cho nhiều nội dung đọc thử hơn.
- Tối ưu onboarding.
- Tạo series video đều đặn.
- Phỏng vấn user thật.
- Tắt quảng cáo gây khó chịu.
- Chưa thuê VPS lớn hơn.
- Chưa chạy paid ads nếu chưa biết conversion.
- Thử VIP giá thấp hoặc trial hợp pháp.

## 15. Nếu sau 6 tháng không đạt kế hoạch

Phân loại nguyên nhân:

### Có traffic nhưng không có tiền

- Giá trị VIP chưa rõ.
- Paywall không đúng thời điểm.
- Payment khó dùng.
- Nội dung trả phí chưa đủ khác biệt.
- Quảng cáo/affiliate chưa đúng đối tượng.

Hành động:

- Test 2-3 gói giá.
- Cho dùng thử tính năng Premium.
- Cải thiện payment và lịch sử giao dịch.
- Đo conversion theo từng truyện.

### Có user ít và retention thấp

- Nội dung chưa phù hợp.
- UX đọc chậm hoặc khó dùng.
- Social traffic không đúng audience.
- Thiếu chapter mới.

Hành động:

- Tập trung nội dung có quyền và nhu cầu rõ.
- Sửa Core Web Vitals/reader performance.
- Tạo lịch cập nhật đều.
- Đổi format video và hook.

### Chi phí cao hơn doanh thu

- Tắt dịch vụ không cần thiết.
- Hạ VPS nếu usage thấp.
- Dùng object storage lifecycle.
- Giảm render video không hiệu quả.
- Tạm dừng paid marketing.
- Giữ backup và monitoring tối thiểu.

## 16. Nếu sau 1 năm không đạt kế hoạch

Đưa ra quyết định dựa trên unit economics:

```text
LTV > CAC
Gross margin đủ trả hạ tầng
Retention tăng hoặc ổn định
```

Các hướng:

1. Tiếp tục với thị trường ngách có retention tốt.
2. Đổi trọng tâm sang B2B cho tác giả/nhà xuất bản.
3. Bán dịch vụ tạo video/truyền thông cho tác giả có hợp đồng.
4. Giảm tính năng tốn chi phí nhưng ít người dùng.
5. Giữ website như sản phẩm cộng đồng và chưa mở rộng server.
6. Dừng các kênh không có attribution.

Không nên tiếp tục trả tiền cho VPS, ads hoặc worker chỉ vì đã đầu tư trước đó.

## 17. Quyết định mở iOS, Android và social

### Nên làm ngay

- Website responsive.
- YouTube/TikTok/Facebook organic.
- UTM và analytics.
- Video từ nội dung có quyền.

### Nên làm sau khi web có funnel ổn

- Android production.
- Push notification.
- Subscription/in-app purchase.

### Nên làm khi đã có retention và ngân sách

- iOS production.
- Paid advertising.
- Nhiều API instance.
- Render video quy mô lớn.

Tiêu chí mở rộng app:

- Web có retention đáng tin cậy.
- Crash-free rate đạt mục tiêu.
- Có người dùng yêu cầu app.
- Có payment flow được kiểm thử.
- Có khả năng duy trì release và support.

## 18. Checklist vận hành hàng tháng

- [ ] Kiểm tra uptime.
- [ ] Kiểm tra backup restore.
- [ ] Kiểm tra CPU/RAM/Disk.
- [ ] Kiểm tra API p95/p99.
- [ ] Kiểm tra error rate.
- [ ] Kiểm tra slow query.
- [ ] Kiểm tra queue/worker.
- [ ] Kiểm tra storage và CDN.
- [ ] Kiểm tra fraud false positive.
- [ ] Kiểm tra retention user.
- [ ] Kiểm tra doanh thu theo nguồn.
- [ ] Kiểm tra chi phí theo nguồn.
- [ ] Tắt campaign không có conversion.
- [ ] Cập nhật kế hoạch 3 tháng tiếp theo.

## 19. Bảng quyết định nhanh

| Tình trạng | Việc nên làm |
|---|---|
| Chưa có user | Local hoặc VPS nhỏ, tập trung nội dung và UX |
| Có user nhưng đọc chậm | Tối ưu reader/CDN/storage trước khi nâng VPS |
| CPU cao do worker | Tách worker hoặc giới hạn concurrency |
| API chậm do DB | Tối ưu query/index trước khi scale |
| Queue tăng | Tăng worker có kiểm soát |
| Có traffic nhưng không mua | Sửa offer, paywall và payment flow |
| Có nhiều view social nhưng ít click | Sửa CTA, landing page và attribution |
| Có nhiều click nhưng ít signup | Sửa onboarding và tốc độ trang |
| Có user trả phí nhưng lỗ | Tính lại CAC, LTV và chi phí nội dung |
| Nhiều lỗi sau deploy | Error fingerprint, rollback và test regression |
| Nghi ngờ fraud | Watch list, risk score và review thủ công |

## 20. Kết luận khuyến nghị

Phương án thực tế nhất:

1. Bắt đầu local hoặc VPS SSD 2.
2. Dùng object storage cho file truyện và video.
3. Deploy website trước, Android sau, iOS khi có retention.
4. Xây YouTube, TikTok và Facebook bằng module tạo video có review bản quyền.
5. Dùng VIP/xu làm nguồn doanh thu chính về lâu dài.
6. Dùng quảng cáo và affiliate làm nguồn phụ.
7. Theo dõi user, reading duration, retention, revenue và server metrics.
8. Không nâng VPS chỉ vì tổng user tăng; nhìn concurrent readers, RPS, p95 và queue.
9. Không chạy paid ads trước khi funnel organic có conversion.
10. Sau 3 tháng tối ưu retention; sau 6 tháng kiểm tra monetization; sau 1 năm quyết định scale hoặc đổi mô hình.

Mục tiêu của năm đầu không chỉ là có doanh thu, mà là chứng minh ba điều:

```text
User quay lại
  + User sẵn sàng trả tiền
  + Chi phí phục vụ một user thấp hơn giá trị user tạo ra
```
