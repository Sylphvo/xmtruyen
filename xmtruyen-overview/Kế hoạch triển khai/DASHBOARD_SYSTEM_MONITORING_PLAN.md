# Kế hoạch Dashboard Monitoring và phân tích hệ thống Xóm Truyện

## 1. Mục tiêu

Mở rộng Dashboard Admin thành trung tâm quan sát toàn hệ thống, giúp quản trị viên biết:

- Server đang chạy ổn định, chậm hay quá tải.
- API, database, storage và worker có lỗi ở đâu.
- Hệ thống có dấu hiệu phát sinh bug hay không.
- User nào hoạt động bình thường, user nào có hành vi đáng ngờ.
- User click nhiều, đọc nhiều hoặc có hành vi bất thường.
- Tính năng nào đang được sử dụng nhiều.
- Tính năng nào cần tối ưu.
- Thành phần nào cần scale trước.
- Khi nào nên nâng cấp VPS hoặc tách dịch vụ.

Dashboard phải cung cấp số liệu và bằng chứng, không tự kết luận người dùng gian lận chỉ từ một dấu hiệu đơn lẻ.

## 2. Nguyên tắc thiết kế

- Dữ liệu monitoring phải đến từ backend, database, log và metrics collector.
- Không đo CPU/RAM server bằng frontend browser.
- Không kết luận fraud chỉ dựa trên số lượt click.
- Mọi cảnh báo phải có thời gian, nguồn dữ liệu, mức độ và lý do.
- Phân biệt số liệu realtime và số liệu tổng hợp theo ngày.
- Có drill-down từ KPI xuống request, user, endpoint hoặc job cụ thể.
- Có retention policy cho log và dữ liệu hành vi.
- Ẩn hoặc băm dữ liệu nhạy cảm.
- Dashboard lỗi không được làm ảnh hưởng API chính.
- Monitoring endpoint cần cache, timeout và quyền Admin riêng.

## 3. Bố cục Dashboard đề xuất

### Khu vực A - Tổng trạng thái hệ thống

Hiển thị ở đầu trang:

- Overall status: `HEALTHY`, `DEGRADED`, `UNHEALTHY`.
- Thời điểm cập nhật gần nhất.
- Uptime của API.
- Số cảnh báo đang mở.
- Số lỗi Critical trong 24 giờ.
- Số request lỗi trong 5 phút gần nhất.
- Số người đọc đồng thời.
- Phiên bản frontend, API và worker.

Màu trạng thái:

| Trạng thái | Ý nghĩa |
|---|---|
| Xanh | Hoạt động bình thường |
| Vàng | Có cảnh báo hoặc đang tiến gần ngưỡng |
| Đỏ | Có lỗi nghiêm trọng hoặc service không hoạt động |
| Xám | Chưa có dữ liệu hoặc chưa kết nối |

### Khu vực B - Server và hạ tầng

Các metric cần hiển thị:

- CPU usage trung bình và cao nhất.
- RAM used/free.
- Swap usage.
- Disk used/free.
- Disk I/O.
- Network inbound/outbound.
- Open file descriptors.
- Process count.
- Container count nếu dùng Docker.
- Load average.
- Server uptime.
- Nhiệt độ nếu nhà cung cấp cho phép đọc.

Mỗi metric cần có:

- Giá trị hiện tại.
- Giá trị trung bình 5 phút.
- Giá trị cao nhất 1 giờ.
- Sparkline 24 giờ.
- Ngưỡng cảnh báo.
- Link tới chi tiết.

### Khu vực C - API performance

Theo dõi:

- Requests per second.
- Request count theo endpoint.
- Latency p50, p95, p99.
- HTTP 2xx, 4xx, 5xx.
- Timeout count.
- Response size.
- Slowest endpoints.
- Endpoint có tỷ lệ lỗi cao nhất.
- Số request đang chờ.
- Số connection đang mở.
- Tỷ lệ retry.

Không dùng chỉ latency trung bình. Cần dùng p95/p99 vì một nhóm request chậm có thể bị che bởi average.

### Khu vực D - Database

Theo dõi PostgreSQL:

- Connection đang dùng/tối đa.
- Query per second.
- Transaction per second.
- Query p95/p99.
- Slow query count.
- Lock và deadlock.
- Cache hit ratio.
- Sequential scan.
- Index scan.
- Table size.
- Index size.
- Database size.
- Replication lag nếu có replica.
- Failed transaction.
- Long-running query.
- Bloat và vacuum status.

Cảnh báo quan trọng:

- Connection pool gần đầy.
- Query chạy quá lâu.
- Deadlock tăng.
- Cache hit giảm.
- Database disk gần đầy.
- Migration chưa chạy.

### Khu vực E - Worker và queue

Theo dõi các job:

- Queue depth.
- Job đang chạy.
- Job thành công.
- Job thất bại.
- Job retry.
- Job bị dead-letter.
- Thời gian chờ trung bình.
- Thời gian xử lý trung bình.
- Worker concurrency.
- PDF/EPUB processing.
- ZIP/CBZ processing.
- OCR.
- Translation.
- Audio.
- Video.

Cảnh báo:

- Queue tăng liên tục.
- Job chờ quá lâu.
- Retry vượt giới hạn.
- Worker không heartbeat.
- Một loại job chiếm hết CPU/RAM.

### Khu vực F - Storage và CDN

Theo dõi:

- Dung lượng đã dùng.
- Dung lượng còn trống.
- Tốc độ upload.
- Tốc độ download.
- Số file mới.
- File xử lý lỗi.
- Object storage request count.
- CDN cache hit ratio.
- CDN cache miss ratio.
- Bandwidth theo loại file.
- Ảnh chapter lỗi hoặc thiếu.
- File tạm quá hạn.

Không nên để API server làm proxy toàn bộ ảnh chapter hoặc video nếu CDN/object storage có thể phục vụ trực tiếp.

## 4. Theo dõi lỗi và nguy cơ bug

### 4.1. Error rate

Dashboard cần tổng hợp:

- Lỗi frontend JavaScript.
- Lỗi API.
- Lỗi database.
- Lỗi background worker.
- Lỗi upload.
- Lỗi payment.
- Lỗi storage.
- Lỗi SignalR/WebSocket nếu có.
- Lỗi timeout.

Mỗi lỗi cần có:

- Error fingerprint.
- Service.
- Endpoint hoặc screen.
- Version release.
- Số lần xảy ra.
- Số user bị ảnh hưởng.
- Lần đầu và lần cuối xuất hiện.
- Stack trace ở hệ thống log bảo mật.
- Mức severity.

### 4.2. Bug risk score

Không gọi đây là dự đoán chắc chắn. Đây là điểm ưu tiên điều tra dựa trên tín hiệu:

```text
BugRiskScore =
  ErrorRateScore
  + RegressionScore
  + LatencyScore
  + RetryScore
  + AffectedUserScore
  + RecentDeployScore
```

Tín hiệu làm điểm tăng:

- Error tăng đột ngột sau deploy.
- Một endpoint có p95 tăng mạnh.
- Nhiều user gặp cùng error fingerprint.
- Retry hoặc timeout tăng.
- Một page frontend crash nhiều lần.
- Queue job fail cùng loại.
- Database deadlock hoặc constraint error tăng.

Mức đề xuất:

| Điểm | Mức | Hành động |
|---:|---|---|
| 0-24 | Thấp | Theo dõi |
| 25-49 | Vừa | Tạo investigation task |
| 50-74 | Cao | Ưu tiên xử lý |
| 75-100 | Critical | On-call hoặc rollback |

Điểm phải có link tới bằng chứng, không chỉ hiển thị một con số.

## 5. Phân tích user và hành vi đọc

### 5.1. User activity

Theo dõi theo ngày/tuần/tháng:

- Registered users.
- Active users.
- Returning users.
- Concurrent users.
- Concurrent readers.
- Session count.
- Session duration.
- Chapters read.
- Books opened.
- Completion rate.
- Search count.
- Bookmark count.
- Review count.
- Error sessions.

### 5.2. Reading analytics

Hiển thị:

- Tổng lượt đọc.
- Tổng thời gian đọc.
- Thời gian đọc trung bình.
- Thời gian đọc trung vị.
- Top truyện theo lượt đọc.
- Top truyện theo tổng thời gian đọc.
- Chapter có tỷ lệ rời cao.
- Chapter có tỷ lệ hoàn thành cao.
- Người đọc theo thiết bị.
- Người đọc theo quốc gia nếu được phép thu thập.
- Người đọc khách và user đăng nhập.
- Giờ cao điểm.

Không nên dùng số lượt mở chapter đơn thuần để đánh giá chất lượng. Cần kết hợp thời gian đọc, scroll/progress và tỷ lệ hoàn thành.

### 5.3. User sạch và user đáng ngờ

Dashboard không nên hiển thị nhãn chắc chắn `user gian lận` khi chưa có quy trình điều tra. Nên dùng các trạng thái:

- `NORMAL`: chưa thấy tín hiệu bất thường.
- `WATCH`: có tín hiệu cần theo dõi.
- `REVIEW`: cần nhân viên kiểm tra.
- `CONFIRMED_ABUSE`: chỉ gán sau khi có bằng chứng và quy trình duyệt.

Các tín hiệu đáng ngờ có thể gồm:

- Click quá nhanh và lặp theo chu kỳ máy móc.
- Nhiều tài khoản dùng cùng device fingerprint bất thường.
- Nhiều account dùng cùng IP trong thời gian ngắn.
- Request vượt xa phân phối bình thường.
- Tạo account, nhận ưu đãi và giao dịch theo mẫu lặp.
- Mở chapter nhưng thời gian đọc gần bằng 0 liên tục.
- Gửi nhiều request song song trái với flow UI.
- Thử nhiều mã giảm giá hoặc payment thất bại liên tục.
- Token/session có hành vi bất thường.
- User agent hoặc header thay đổi không tự nhiên.

Một tín hiệu đơn lẻ không đủ để khóa user. Cần risk score, bằng chứng, ngưỡng và review thủ công.

### 5.4. Fraud risk score

Ví dụ công thức có thể cấu hình:

```text
FraudRiskScore =
  ClickBurstScore * 0.20
  + RequestAnomalyScore * 0.25
  + AccountPatternScore * 0.20
  + PaymentRiskScore * 0.20
  + ReadingPatternScore * 0.15
```

Điểm cần lưu:

- Score hiện tại.
- Score theo thời gian.
- Rule nào kích hoạt.
- Dữ liệu đầu vào đã băm/ẩn danh.
- Người duyệt.
- Quyết định cuối cùng.

Không được tự động khóa tài khoản chỉ vì score cao nếu chưa có policy được phê duyệt.

## 6. Tính năng và cơ hội sản phẩm

Dashboard nên chỉ ra:

- Tính năng được dùng nhiều nhất.
- Tính năng ít được dùng.
- Tính năng có nhiều lỗi.
- Tính năng khiến user quay lại.
- Tính năng làm tăng thời gian đọc.
- Tính năng bị bỏ giữa chừng.
- Tính năng được yêu cầu nhiều nhưng chưa có.
- Tính năng có chi phí vận hành cao.
- Tính năng có tỷ lệ chuyển đổi tốt.

Ví dụ các câu hỏi cần trả lời:

- User dùng search nhưng không mở kết quả nào vì kết quả chưa tốt?
- User mở chapter VIP rồi rời đi vì paywall quá sớm?
- Bookmark có làm tăng tỷ lệ quay lại không?
- Audio có tạo thời gian sử dụng cao hơn text không?
- Comic image delivery có làm tăng bandwidth đột biến không?
- Translation review có làm chậm publish không?

Cần event tracking có schema ổn định, không tự đặt tên event tùy ý ở từng page.

## 7. Tối ưu hóa và scale recommendation

### 7.1. Quy tắc khuyến nghị

Dashboard có thể đưa ra đề xuất dạng:

```text
IF cpu_p95 > 70% trong 15 phút
AND api_p95 không tăng
THEN kiểm tra worker hoặc background job trước khi nâng VPS
```

```text
IF api_p95 > 1000ms
AND database_slow_queries tăng
THEN tối ưu query/index trước khi tăng CPU
```

```text
IF concurrent_readers tăng
AND CDN_cache_hit thấp
THEN cấu hình CDN/object storage trước khi scale API
```

```text
IF queue_depth tăng liên tục
AND worker_cpu > 80%
THEN tăng worker concurrency hoặc tách worker
```

```text
IF database_connection_usage > 80%
THEN tăng pool hợp lý hoặc tách database trước khi thêm API instance
```

### 7.2. Các loại tối ưu

- Database index.
- Query batching.
- Pagination.
- Caching.
- CDN.
- Lazy loading ảnh.
- Compress WebP/AVIF.
- Connection pooling.
- Queue background job.
- Giới hạn concurrency.
- Rate limiting.
- Debounce search.
- API response shaping.
- Code splitting frontend.
- Giảm log quá mức.
- Cleanup file tạm.

### 7.3. Các loại scale

- Vertical scale: tăng CPU/RAM trên VPS.
- Horizontal scale: chạy nhiều API instance.
- Database scale: tách PostgreSQL, read replica.
- Worker scale: tăng worker hoặc queue consumer.
- Storage scale: object storage.
- Delivery scale: CDN.
- Cache scale: Redis.

Dashboard phải giải thích vì sao khuyến nghị scale, không chỉ hiển thị `Nên nâng cấp`.

## 8. API monitoring đề xuất

### 8.1. Tổng hợp hệ thống

```http
GET /api/admin/monitoring/overview?range=1h
```

Response nên gồm:

```json
{
  "timestamp": "2026-08-25T10:00:00Z",
  "overallStatus": "HEALTHY",
  "server": {
    "cpuPercent": 42.3,
    "memoryPercent": 58.1,
    "diskPercent": 61.2,
    "networkOutMbps": 4.8
  },
  "api": {
    "requestsPerSecond": 3.2,
    "p95Ms": 240,
    "errorRatePercent": 0.2
  },
  "database": {
    "connectionPercent": 34,
    "slowQueries": 1,
    "deadlocks": 0
  },
  "worker": {
    "queueDepth": 4,
    "failedJobs": 0
  },
  "users": {
    "active": 12,
    "concurrentReaders": 5,
    "watchListCount": 0
  },
  "alerts": []
}
```

### 8.2. Chi tiết metrics

```http
GET /api/admin/monitoring/metrics?metric=api_latency&range=24h
GET /api/admin/monitoring/alerts?status=open
GET /api/admin/monitoring/endpoints?range=1h
GET /api/admin/monitoring/slow-queries?range=24h
GET /api/admin/monitoring/jobs?status=failed
GET /api/admin/monitoring/users/risk?range=24h
GET /api/admin/monitoring/features?range=30d
```

Các endpoint này phải yêu cầu quyền Admin/Operator phù hợp và có pagination.

## 9. Data model và telemetry

### 9.1. Request metric

```text
RequestMetric
- Id
- Timestamp
- Method
- RouteTemplate
- StatusCode
- DurationMs
- UserIdHash
- TraceId
- Service
- ReleaseVersion
```

### 9.2. Reading event

```text
ReadingEvent
- Id
- Timestamp
- UserIdHash hoặc GuestSessionHash
- PublicationId
- ChapterId
- EventType
- ReadingDurationSeconds
- ProgressPercent
- DeviceType
- AppVersion
- TraceId
```

### 9.3. Security/fraud event

```text
RiskEvent
- Id
- Timestamp
- UserIdHash
- SessionHash
- RuleCode
- RiskScore
- EvidenceJson đã loại bỏ dữ liệu nhạy cảm
- Status
- ReviewedBy
- ReviewedAt
```

### 9.4. Bug/error event

```text
ErrorEvent
- Id
- Timestamp
- Fingerprint
- Service
- Route
- Severity
- ReleaseVersion
- UserImpactCount
- TraceId
- Status
```

## 10. Bảo mật và quyền riêng tư

- Không hiển thị password, access token hoặc refresh token.
- Không ghi raw payment information.
- Hash hoặc pseudonymize user id khi dùng cho analytics.
- Hạn chế lưu IP đầy đủ; áp dụng policy pháp lý phù hợp.
- Không lưu nội dung đọc riêng tư nếu không cần.
- Phân quyền xem metrics server, user risk và payment risk riêng biệt.
- Audit mọi thao tác xem/export risk data.
- Đặt thời hạn xóa telemetry.
- Cho phép xử lý yêu cầu xóa dữ liệu user theo policy.
- Không dùng device fingerprint để theo dõi vượt quá mục đích bảo mật đã công bố.

## 11. Các phase triển khai

### Phase 1 - Tận dụng dữ liệu hiện có

- [ ] Dùng `/api/admin/health` cho PostgreSQL, worker và disk.
- [ ] Hiển thị overall status.
- [ ] Hiển thị response time database.
- [ ] Hiển thị dung lượng disk.
- [ ] Thêm link tới Health Check.
- [ ] Thêm link tới Error Logs.
- [ ] Thêm link tới Reading Analytics.
- [ ] Ghi trạng thái `Chưa có dữ liệu` khi API không trả về.

### Phase 2 - API metrics

- [ ] Thêm middleware đo request duration.
- [ ] Ghi status code và route template.
- [ ] Tạo aggregation theo 1 phút.
- [ ] Tạo endpoint overview.
- [ ] Thêm p50/p95/p99.
- [ ] Thêm error rate.
- [ ] Thêm alert threshold.

### Phase 3 - Database và worker

- [ ] Thu thập connection usage.
- [ ] Thu thập slow query.
- [ ] Thu thập deadlock.
- [ ] Thu thập queue depth.
- [ ] Thu thập retry/failure.
- [ ] Thêm worker heartbeat.
- [ ] Thêm cảnh báo job chờ lâu.

### Phase 4 - User behavior

- [ ] Chuẩn hóa event schema.
- [ ] Đo session và reading duration.
- [ ] Đo concurrent readers.
- [ ] Đo completion/progress.
- [ ] Đo feature adoption.
- [ ] Tạo báo cáo user activity.

### Phase 5 - Fraud prevention

- [ ] Liệt kê abuse rules.
- [ ] Tạo risk event.
- [ ] Tạo risk score có giải thích.
- [ ] Tạo watch list.
- [ ] Tạo review workflow.
- [ ] Thêm rate limit.
- [ ] Không auto-ban nếu chưa có policy và human review.

### Phase 6 - Bug intelligence

- [ ] Error fingerprint.
- [ ] Release correlation.
- [ ] Regression detection.
- [ ] Affected user count.
- [ ] Bug risk score.
- [ ] Link tới error detail và test case.
- [ ] Tạo task tự động khi vượt ngưỡng.

### Phase 7 - Recommendation và scale

- [ ] Tạo rule engine cho recommendation.
- [ ] Phân biệt optimize và scale.
- [ ] Hiển thị bằng chứng cho recommendation.
- [ ] Lưu lịch sử recommendation.
- [ ] Theo dõi kết quả sau khi tối ưu/nâng cấp.
- [ ] Cho phép Admin acknowledge hoặc dismiss cảnh báo.

## 12. Ngưỡng cảnh báo ban đầu

| Metric | Warning | Critical |
|---|---:|---:|
| CPU | > 65% trong 15 phút | > 80% trong 15 phút |
| RAM | > 70% | > 85% |
| Disk | > 70% | > 85% |
| Swap | > 5% | > 15% |
| API p95 | > 500 ms | > 1.000 ms |
| API p99 | > 1.000 ms | > 2.000 ms |
| HTTP 5xx | > 1% | > 3% |
| DB connections | > 70% | > 85% |
| Slow queries | > 5/phút | > 20/phút |
| Queue depth | > 20 | > 100 |
| Job failure | > 2% | > 10% |
| CDN cache hit | < 80% | < 60% |
| Concurrent readers | Theo baseline | Vượt capacity test |

Các ngưỡng phải được hiệu chỉnh theo cấu hình VPS và baseline thực tế. Không dùng cứng các ngưỡng này cho production mà không đo baseline.

## 13. Kiểm thử

### Server/API

- [ ] Metrics vẫn ghi khi request thành công.
- [ ] Metrics vẫn ghi khi API trả 4xx/5xx.
- [ ] Không làm tăng latency đáng kể.
- [ ] Monitoring API timeout không làm lỗi request chính.
- [ ] Alert không gửi lặp vô hạn.
- [ ] Dashboard xử lý thiếu metric.

### Database/worker

- [ ] Database down.
- [ ] Connection pool đầy.
- [ ] Slow query.
- [ ] Deadlock.
- [ ] Queue tăng.
- [ ] Job retry.
- [ ] Worker mất heartbeat.

### User/fraud

- [ ] Guest và authenticated user.
- [ ] User đọc lâu bình thường.
- [ ] User click nhanh nhưng hợp lệ.
- [ ] Bot pattern mô phỏng.
- [ ] Nhiều account cùng IP.
- [ ] Payment retry.
- [ ] Không khóa nhầm user bình thường.

### Scale

- [ ] Load test theo số concurrent readers.
- [ ] Load test text reader.
- [ ] Load test comic reader.
- [ ] Load test upload/processing.
- [ ] Đo trước và sau CDN.
- [ ] Đo trước và sau database index.
- [ ] Đo trước và sau khi tách worker.

## 14. Definition of Done

- Dashboard có trạng thái tổng thể và thời điểm cập nhật.
- Có server metrics: CPU, RAM, disk, network.
- Có API metrics: RPS, p95/p99, error rate.
- Có database metrics và slow query signal.
- Có worker/queue metrics.
- Có storage/CDN metrics.
- Có error list và bug risk có bằng chứng.
- Có reading analytics và feature analytics.
- Có user watch list nhưng không kết luận gian lận thiếu căn cứ.
- Có fraud risk score giải thích được.
- Có recommendation optimize/scale dựa trên ngưỡng.
- Có quyền, audit và privacy policy.
- Có test cho lỗi, tải cao, retry và false positive.

## 15. MVP đề xuất cho hệ thống hiện tại

Ưu tiên làm theo thứ tự:

1. Health status hiện có.
2. API latency và error rate.
3. PostgreSQL connections và slow queries.
4. Worker queue và failed jobs.
5. Reading duration và concurrent readers.
6. Error fingerprint và bug risk.
7. Feature usage.
8. Fraud watch list.
9. Scale recommendations.

Không nên làm fraud detection trước khi có request telemetry, session tracking và reading event đủ tin cậy. Không nên đưa ra quyết định nâng VPS trước khi có baseline tối thiểu 7-14 ngày.
