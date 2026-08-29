# Kế hoạch Deploy và mở rộng Xóm Truyện theo lưu lượng

## 1. Mục tiêu

Triển khai Xóm Truyện từ giai đoạn chưa có người dùng đến khi có nhiều người dùng mà không thuê VPS quá lớn ngay từ đầu.

Nguyên tắc:

- Bắt đầu với hạ tầng nhỏ, chi phí thấp.
- Theo dõi số liệu thực tế trước khi nâng cấp.
- Tách file truyện khỏi ổ đĩa VPS.
- Nâng cấp theo CPU, RAM, database, request/giây và số người đọc đồng thời.
- Không quyết định chỉ dựa trên tổng số tài khoản đăng ký.

## 2. Phân biệt các loại lưu lượng

Tổng số user không phản ánh chính xác tải hệ thống. Cần theo dõi riêng:

- **Registered users:** tổng số tài khoản đã đăng ký.
- **Active users:** số user hoạt động trong ngày/tháng.
- **Concurrent users:** số user online cùng lúc.
- **Concurrent readers:** số người đang đọc truyện cùng lúc.
- **Requests per second:** số request API mỗi giây.
- **Heavy jobs:** số job xử lý PDF, EPUB, ZIP, OCR, audio và video.
- **Storage traffic:** lưu lượng tải ảnh chapter, PDF, audio và video.

Ví dụ: 50 người đọc truyện tranh cùng lúc có thể tạo tải lớn hơn 500 user chỉ đăng nhập hoặc xem trang chủ.

## 3. Kiến trúc không nên dùng ngay từ đầu

Khi chưa có người dùng, chưa cần:

- Kubernetes.
- Docker Swarm.
- Load balancer nhiều node.
- Database cluster.
- Read replica.
- Microservices phức tạp.
- VPS 7, VPS 8 hoặc VPS 9.
- Nhiều worker chạy song song.

Các thành phần này chỉ nên thêm khi monitoring cho thấy hệ thống thực sự cần.

## 4. Giai đoạn 0 - Development, chưa có user

### Mục tiêu

Chạy được toàn bộ hệ thống để phát triển và kiểm tra:

- Admin frontend.
- Client frontend.
- .NET API.
- PostgreSQL.
- Background worker nhẹ.

### Phương án

Có thể dùng máy cá nhân hoặc VPS SSD 1:

- 2 CPU.
- 2 GB RAM.
- 40 GB SSD.

Nếu chỉ cần xem giao diện Admin và chưa chạy backend, không cần thuê VPS. Có thể chạy Admin ở chế độ demo local.

### Lưu ý

- Không lưu file truyện lớn trong VPS.
- Không dùng dữ liệu thật trong giai đoạn test.
- Không mở database trực tiếp ra Internet.
- Tạo dữ liệu mẫu bằng seed script hoặc CSV.

## 5. Giai đoạn 1 - Production nhỏ, 0-100 user

### VPS đề xuất

Chọn VPS SSD 2:

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

### Dịch vụ nên có

- Cloudflare DNS và SSL.
- Firewall chỉ mở port 80, 443 và SSH giới hạn IP.
- PostgreSQL chỉ cho phép kết nối nội bộ.
- Backup database hằng ngày.
- Monitoring CPU, RAM, disk và response time.
- Object storage cho ảnh, PDF và file truyện.

### Khi chưa cần nâng cấp

Giữ nguyên VPS nếu:

- CPU trung bình dưới 50%.
- RAM dưới 60%.
- Không dùng swap hoặc swap rất ít.
- API p95 dưới 300 ms.
- HTTP 5xx dưới 0,5%.
- Database hoạt động ổn định.

## 6. Giai đoạn 2 - 100-500 user

### VPS đề xuất

Có thể nâng lên VPS SSD 3 hoặc VPS SSD 4:

- VPS SSD 3: 4 CPU, 6 GB RAM.
- VPS SSD 4: 4 CPU, 8 GB RAM.

### Cách tổ chức

Ban đầu vẫn có thể chạy API, Admin và database chung một VPS. Khi database hoặc worker nặng, tách dần:

```text
VPS Web:
- Nginx
- Frontend
- .NET API

VPS Database:
- PostgreSQL
- Backup

Object Storage:
- Ảnh chapter
- PDF
- Audio
- Video
```

### Nên bổ sung

- Redis cho cache, rate limiting hoặc queue nhẹ.
- CDN cho ảnh bìa, ảnh chapter và file tĩnh.
- Queue riêng cho upload, import và xử lý file.
- Log tập trung cho API.

## 7. Giai đoạn 3 - 500-2.000 user

### VPS đề xuất

Dùng VPS SSD 4 hoặc VPS SSD 5 tùy số người đọc đồng thời:

- 4-6 CPU.
- 8-10 GB RAM.
- Database tách riêng.
- Worker tách riêng nếu xử lý file nặng.

### Kiến trúc

```text
VPS Web:
- Nginx
- Admin frontend
- Client frontend
- API instance

VPS Database:
- PostgreSQL
- Scheduled backup

VPS Worker:
- PDF/EPUB processing
- OCR
- ZIP/CBZ processing
- Audio/video jobs

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

### Ưu tiên nâng cấp

1. Tách file sang object storage nếu chưa làm.
2. Tách worker khỏi API.
3. Tối ưu database và index.
4. Dùng Redis cache.
5. Tăng RAM/CPU.
6. Chạy nhiều API instance khi cần.

## 8. Giai đoạn 4 - Trên 2.000 user

Chỉ triển khai khi số liệu thực tế yêu cầu:

- Load balancer.
- Nhiều API instance.
- PostgreSQL riêng có backup nâng cao.
- Read replica nếu truy vấn đọc rất lớn.
- Redis riêng.
- Worker autoscaling.
- CDN bắt buộc cho nội dung đọc.
- Monitoring và cảnh báo 24/7.
- Disaster recovery và kế hoạch rollback.

Không nên triển khai giai đoạn này chỉ vì tổng số user đã vượt 2.000. Cần xem concurrent readers và request/giây trước.

## 9. Ngưỡng theo dõi và quyết định nâng cấp

| Chỉ số | Bình thường | Cần theo dõi | Nên nâng cấp hoặc tối ưu |
|---|---:|---:|---:|
| CPU trung bình | < 50% | 50-70% | > 70% liên tục 15 phút |
| RAM | < 60% | 60-75% | > 80% |
| Swap | 0 | Có ít | Tăng liên tục |
| Disk | < 60% | 60-75% | > 80% |
| API p95 | < 300 ms | 300-800 ms | > 1 giây |
| API p99 | < 800 ms | 800 ms-2 giây | > 2 giây |
| HTTP 5xx | < 0,5% | 0,5-2% | > 2% |
| Database CPU | < 50% | 50-70% | > 70% liên tục |
| Database RAM | < 60% | 60-75% | > 80% |
| Concurrent readers | < 20 | 20-50 | > 50 |
| API requests/giây | < 10 | 10-30 | > 30 |
| Queue chờ xử lý | < 10 job | 10-50 job | > 50 job liên tục |

Các ngưỡng phải duy trì trong một khoảng thời gian, không nâng cấp chỉ vì một đợt tăng tải ngắn.

## 10. Quy tắc quyết định theo tình huống

### CPU cao, RAM bình thường

Nguyên nhân có thể là:

- API query nặng.
- Worker xử lý PDF/OCR.
- Nén hoặc giải nén file.
- Thiếu index database.

Hành động:

1. Xem process nào dùng CPU.
2. Tối ưu query.
3. Tách worker.
4. Sau đó mới tăng CPU.

### RAM cao, CPU bình thường

Nguyên nhân có thể là:

- PostgreSQL cache lớn.
- Worker giữ file trong memory.
- Memory leak trong API.
- Chạy quá nhiều process.

Hành động:

1. Kiểm tra process dùng RAM.
2. Giới hạn worker concurrency.
3. Tối ưu memory.
4. Tăng RAM nếu vẫn vượt 80%.

### API chậm nhưng CPU và RAM thấp

Nguyên nhân có thể là:

- Query database chậm.
- Thiếu index.
- API gọi dịch vụ ngoài.
- Ảnh/file đang đi qua API thay vì CDN.
- Network latency.

Không nên nâng VPS ngay. Cần kiểm tra trace và database query trước.

### Tốc độ đọc truyện chậm

Ưu tiên xử lý:

1. Đưa ảnh chapter lên object storage.
2. Dùng CDN.
3. Dùng WebP/AVIF và kích thước phù hợp.
4. Lazy-load ảnh.
5. Thêm cache header.
6. Chỉ nâng băng thông/VPS khi CDN và storage đã đúng.

### Disk đầy nhanh

Không chỉ nâng SSD. Cần:

1. Xác định thư mục chiếm dung lượng.
2. Đưa PDF, ảnh, audio và video sang object storage.
3. Thiết lập retention cho file tạm.
4. Xóa log cũ theo chính sách.
5. Backup trước khi xóa.

## 11. Storage và file truyện

Không nên lưu lâu dài trên ổ VPS:

- PDF gốc.
- Ảnh chapter.
- File ZIP/CBZ/CBR.
- Audio.
- Video.
- File xử lý tạm.

Nên dùng:

- Cloudflare R2.
- Amazon S3.
- Backblaze B2.
- MinIO trên server riêng.

VPS chỉ lưu:

- Database.
- Cache.
- File tạm ngắn hạn.
- Log có giới hạn.
- Application binaries.

## 12. Backup bắt buộc

### Database

- Backup tự động hằng ngày.
- Giữ tối thiểu 7-14 bản backup.
- Lưu backup ở máy hoặc storage khác VPS.
- Kiểm tra restore định kỳ.
- Không chỉ kiểm tra việc tạo file backup; phải thử khôi phục thật.

### Object storage

- Bật versioning nếu dịch vụ hỗ trợ.
- Có lifecycle cho file tạm.
- Có bản sao hoặc backup quan trọng.
- Không xóa file gốc trước khi xác nhận file processed hợp lệ.

## 13. Monitoring tối thiểu

Cần theo dõi:

- CPU usage.
- RAM usage.
- Swap usage.
- Disk usage.
- Network in/out.
- API request count.
- API p50/p95/p99 latency.
- HTTP 4xx/5xx.
- Database connections.
- Slow queries.
- Queue length.
- Worker failure.
- Concurrent readers.

Công cụ có thể dùng:

- Uptime Kuma.
- Netdata.
- Grafana + Prometheus.
- Sentry cho lỗi frontend/API.
- PostgreSQL slow query log.

## 14. Kế hoạch nâng cấp khuyến nghị

```text
Chưa có user
  -> Local hoặc VPS SSD 1

0-100 user
  -> VPS SSD 2

100-500 user
  -> VPS SSD 3/4
  -> CDN + object storage

500-2.000 user
  -> VPS web + database + worker
  -> Redis và queue

Trên 2.000 user
  -> Load balancer
  -> Nhiều API instance
  -> Database scaling
  -> Worker scaling
```

## 15. Lựa chọn cho dự án hiện tại

### Nếu chỉ muốn chạy thử

Dùng VPS SSD 1 hoặc chạy local. Không cần thuê gói lớn.

### Nếu muốn chạy production nhỏ

Dùng VPS SSD 2:

- Đủ cho API .NET.
- Đủ cho PostgreSQL nhỏ.
- Đủ cho Admin và client.
- Chi phí hợp lý.
- Có thể nâng cấp sau.

### Nếu muốn chạy thêm worker xử lý file

Dùng VPS SSD 3:

- 4 CPU.
- 6 GB RAM.
- Phù hợp hơn với import, ZIP/CBZ, PDF hoặc OCR nhẹ.
- Vẫn cần object storage riêng.

## 16. Thứ tự triển khai thực tế

- [ ] Đăng ký VPS SSD 2 hoặc dùng local để test.
- [ ] Cài Ubuntu LTS.
- [ ] Cài Nginx.
- [ ] Cài .NET runtime.
- [ ] Cài PostgreSQL.
- [ ] Cấu hình firewall.
- [ ] Cấu hình domain và SSL.
- [ ] Deploy API.
- [ ] Deploy Admin frontend.
- [ ] Deploy Client frontend.
- [ ] Cấu hình backup database.
- [ ] Cấu hình object storage.
- [ ] Cấu hình monitoring.
- [ ] Tạo seed data development.
- [ ] Chạy smoke test.
- [ ] Theo dõi số liệu trước khi nâng cấp.

## 17. Kết luận

Phương án phù hợp nhất là bắt đầu nhỏ:

1. Development: local hoặc VPS SSD 1.
2. Production chưa có user: VPS SSD 2.
3. Khi có worker/file processing hoặc khoảng 100-500 user: VPS SSD 3/4.
4. Khi tải tăng: tách database, worker và storage trước khi mua VPS cực lớn.
5. Chỉ nâng cấp khi CPU, RAM, database, request/giây hoặc concurrent readers vượt ngưỡng.

**Khuyến nghị cuối:** bắt đầu bằng VPS SSD 2, không lưu file truyện trên VPS, bật monitoring và backup ngay từ ngày đầu. Đây là cấu hình cân bằng giữa chi phí thấp và khả năng mở rộng an toàn.
