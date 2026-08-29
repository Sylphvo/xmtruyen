# Hướng dẫn triển khai SignalR realtime và polling có cấu hình

## 1. Kết luận quan trọng

SignalR không hoạt động theo kiểu frontend gọi polling liên tục khi kết nối WebSocket hoặc Server-Sent Events đang hoạt động.

SignalR có các transport:

1. WebSockets: ưu tiên sử dụng.
2. Server-Sent Events: fallback.
3. Long Polling: fallback cuối cùng.

Vì vậy cần tách hai loại setting:

- **SignalR connection settings:** transport, timeout, reconnect delays, keep-alive.
- **Application polling settings:** khoảng thời gian frontend gọi lại API khi chưa có SignalR event hoặc khi xem metrics.

Không nên gọi API mỗi vài giây để kiểm tra một dữ liệu mà SignalR đã push realtime.

## 2. Tình trạng hiện tại của Xóm Truyện

### Backend

Backend đã có:

```text
xmtruyen.API/Hubs/NotificationHub.cs
/hubs/notification
```

Backend đang gửi event:

```text
ReceiveNotification
```

### Admin

Admin hiện chưa có package `@microsoft/signalr` và chưa có SignalR client dùng chung.

Một số màn hình đang dùng polling riêng bằng `setInterval`:

- Health Check: 30 giây.
- Comic Video Dashboard: 5 giây.
- Comic Video Job Detail: 5 giây.
- Audio Job Detail.
- Book Video Job Detail.
- Crawler.
- Error service flush: 30 giây.

Mục tiêu là triển khai SignalR thật sự, gom setting về một nơi thay vì hardcode nhiều giá trị trong từng page, đồng thời có polling fallback khi SignalR không kết nối được.

## 3. Bảng chức năng và cơ chế realtime

| Chức năng | Event SignalR | Fallback | Dữ liệu phát từ |
|---|---|---|---|
| Health check | `HealthStatusChanged` | 30 giây | Monitoring service |
| CPU/RAM/Disk | `ServerMetricsUpdated` | 15-30 giây | Agent trên VPS |
| API lỗi | `ErrorCreated` | 15-30 giây | API error middleware |
| Error Logs | `ErrorCreated` | 10-30 giây | Error log service |
| Queue/Worker | `JobProgressUpdated`, `JobFailed` | 5 giây | Worker/job service |
| User online | `PresenceUpdated` | 30-60 giây | Presence service |
| Người đang đọc | `ReadingPresenceUpdated` | 30-60 giây | Reader heartbeat |
| Click/request bất thường | `RiskScoreUpdated` | 1-5 phút | Risk analysis worker |
| Thanh toán | `PaymentStatusChanged` | Webhook retry/status API | Payment webhook handler |
| Upload/import | `ImportProgressUpdated` | 5 giây | Import/job service |
| Cảnh báo hệ thống | `AlertCreated`, `AlertResolved` | 30-60 giây | Alert rule engine |

SignalR chỉ nên gửi event thay đổi hoặc aggregate nhỏ. Không gửi toàn bộ log, nội dung chapter, token, payment secret hay danh sách dữ liệu lớn qua hub.

## 3. Cấu hình đề xuất

Tạo file:

```text
xmtruyen-admin/src/config/realtimeConfig.ts
```

Contract:

```ts
export type RealtimeMode = 'signalr' | 'polling' | 'hybrid' | 'off';

export interface RealtimeConfig {
  mode: RealtimeMode;
  pollingIntervalMs: number;
  healthPollingIntervalMs: number;
  jobPollingIntervalMs: number;
  metricsPollingIntervalMs: number;
  reconnectDelaysMs: number[];
  serverTimeoutMs: number;
  keepAliveIntervalMs: number;
  enableLongPollingFallback: boolean;
}

export const DEFAULT_REALTIME_CONFIG: RealtimeConfig = {
  mode: 'hybrid',
  pollingIntervalMs: 30000,
  healthPollingIntervalMs: 30000,
  jobPollingIntervalMs: 5000,
  metricsPollingIntervalMs: 15000,
  reconnectDelaysMs: [0, 2000, 5000, 10000, 30000],
  serverTimeoutMs: 60000,
  keepAliveIntervalMs: 15000,
  enableLongPollingFallback: true
};
```

## 4. Giải thích các setting

| Setting | Ý nghĩa | Giá trị đề xuất |
|---|---|---:|
| `mode` | Chế độ realtime | `hybrid` |
| `pollingIntervalMs` | Polling mặc định | 30.000 ms |
| `healthPollingIntervalMs` | Kiểm tra health | 30.000 ms |
| `jobPollingIntervalMs` | Theo dõi job | 5.000 ms |
| `metricsPollingIntervalMs` | Dashboard metrics | 15.000 ms |
| `reconnectDelaysMs` | Các lần chờ reconnect | 0, 2, 5, 10, 30 giây |
| `serverTimeoutMs` | Timeout server | 60.000 ms |
| `keepAliveIntervalMs` | Nhịp keep-alive | 15.000 ms |
| `enableLongPollingFallback` | Cho phép fallback | `true` |

Không nên để tất cả tính năng dùng 5 giây. Health và metrics thường không cần nhanh như job progress.

## 5. Cho phép Admin setting từ giao diện

Tạo trang hoặc modal:

```text
xmtruyen-admin/src/pages/RealtimeSettings.tsx
```

Có các control:

- Chế độ: SignalR, Polling, Hybrid, Tắt realtime.
- Health interval: 10, 30, 60 giây.
- Job interval: 2, 5, 10 giây.
- Metrics interval: 15, 30, 60 giây.
- Reconnect timeout.
- Bật/tắt Long Polling fallback.
- Nút `Khôi phục mặc định`.

Quy tắc UI:

- Không cho interval dưới 2 giây nếu không có lý do đặc biệt.
- Hiển thị cảnh báo khi chọn polling quá nhanh.
- Hiển thị số request ước tính mỗi phút.
- Hiển thị trạng thái kết nối hiện tại.
- Chỉ SuperAdmin hoặc Admin có quyền system config mới được sửa cấu hình global.

Công thức ước tính request:

```text
RequestsPerMinute = 60000 / intervalMs * activePages
```

Đây chỉ là ước tính, vì request thực tế còn phụ thuộc visibility, retry và lỗi mạng.

## 6. Lưu cấu hình

### Giai đoạn local/demo

Có thể lưu vào `localStorage`:

```text
xmtruyen.realtime.settings.v1
```

Phải có:

- Schema version.
- Validate số trong khoảng cho phép.
- Fallback về default nếu JSON hỏng.
- Không lưu token hoặc secret.

### Giai đoạn production

Lưu cấu hình trong System Config của backend:

```http
GET /api/admin/system-configs/realtime
PUT /api/admin/system-configs/realtime
```

Cấu hình server phải là source of truth. Frontend chỉ cache bản đọc gần nhất.

## 7. SignalR client dùng chung

Cài package:

```powershell
Push-Location .\xmtruyen-admin
npm install @microsoft/signalr
Pop-Location
```

Tạo service:

```text
xmtruyen-admin/src/services/realtimeService.ts
```

Code khung:

```ts
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  HttpTransportType
} from '@microsoft/signalr';
import { DEFAULT_REALTIME_CONFIG, type RealtimeConfig } from '../config/realtimeConfig';

let connection: HubConnection | null = null;

export const createRealtimeConnection = (config: RealtimeConfig = DEFAULT_REALTIME_CONFIG) => {
  const transport = config.enableLongPollingFallback
    ? HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling
    : HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents;

  connection = new HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_API_URL}/hubs/notification`, { transport })
    .withAutomaticReconnect(config.reconnectDelaysMs)
    .configureLogging(import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning)
    .build();

  connection.serverTimeoutInMilliseconds = config.serverTimeoutMs;
  connection.keepAliveIntervalInMilliseconds = config.keepAliveIntervalMs;

  return connection;
};

export const startRealtime = async (config?: RealtimeConfig) => {
  const current = connection ?? createRealtimeConnection(config);
  if (current.state === HubConnectionState.Disconnected) {
    await current.start();
  }
  return current;
};

export const stopRealtime = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
  }
};
```

Transport fallback cần được kiểm tra với cấu hình proxy/Nginx. Không phải môi trường nào cũng hỗ trợ tất cả transport.

## 8. React hook dùng chung

Tạo:

```text
xmtruyen-admin/src/hooks/useRealtime.ts
```

Hook cần hỗ trợ:

```ts
interface UseRealtimeOptions<T> {
  eventName: string;
  onEvent: (payload: T) => void;
  enabled?: boolean;
}
```

Hook phải:

- Start connection khi component hoặc provider mount.
- Đăng ký event đúng một lần.
- Hủy event handler khi unmount.
- Stop connection khi không còn subscriber.
- Không tạo một connection cho mỗi page.
- Expose `isConnected`, `isReconnecting`, `lastEventAt`, `error`.
- Dùng polling fallback nếu SignalR không kết nối được.

Nên đặt provider ở App root để các page dùng chung connection.

## 9. Hybrid mode

`hybrid` là mode khuyến nghị:

```text
SignalR connected
  -> nhận event push
  -> không polling cùng loại event

SignalR disconnected
  -> polling fallback theo interval đã cấu hình

SignalR reconnected
  -> refetch một lần để đồng bộ dữ liệu
  -> dừng polling fallback
```

Không được chạy song song SignalR push và polling nhanh cho cùng một dữ liệu vì sẽ:

- Tăng request.
- Có thể hiển thị dữ liệu cũ đè dữ liệu mới.
- Tạo duplicate toast.
- Tăng tải database.

## 10. Polling helper

Tạo helper dùng chung:

```text
xmtruyen-admin/src/services/pollingService.ts
```

Yêu cầu:

- Dùng `setTimeout` đệ quy thay vì `setInterval` để tránh request chồng nhau.
- Dừng khi tab không visible.
- Dừng khi component unmount.
- Có retry backoff khi API lỗi.
- Có jitter nhỏ để nhiều browser không gọi cùng một lúc.
- Không poll khi đang loading request trước.
- Hỗ trợ AbortController.

Pseudo-flow:

```text
run request
  -> success: schedule interval bình thường
  -> error: schedule backoff
  -> tab hidden: pause
  -> tab visible: refetch một lần
  -> unmount: abort và clear timeout
```

## 11. Gắn vào các màn hình hiện tại

### Health Check

- Dùng SignalR nếu backend phát event health change.
- Nếu chưa có event, polling `healthPollingIntervalMs`.
- Mặc định 30 giây.

### Job detail và pipeline

- Dùng event `JobProgressUpdated`.
- Fallback polling `jobPollingIntervalMs`.
- Mặc định 5 giây.
- Khi job hoàn thành, dừng polling và refetch detail một lần.

### Error Logs

- Dùng event `ErrorCreated`.
- Fallback polling 10-30 giây.
- Có debounce toast để không spam Admin.

### Reading Analytics

- Không cần realtime từng reading event.
- Aggregate mỗi 15-60 giây.
- Dùng `metricsPollingIntervalMs`.

### Server metrics

- Agent gửi metrics về monitoring service.
- Dashboard nhận aggregate qua SignalR hoặc polling 15-30 giây.
- Không để frontend gọi trực tiếp OS metrics.

### Notifications

- Dùng SignalR `ReceiveNotification`.
- Không polling nếu connection đang hoạt động.

## 12. Event contract đề xuất

```text
HealthStatusChanged
ServerMetricsUpdated
ErrorCreated
JobProgressUpdated
JobCompleted
QueueDepthChanged
UserRiskUpdated
ReadingAggregateUpdated
```

Mỗi event nên có:

```json
{
  "eventId": "uuid",
  "occurredAt": "2026-08-25T10:00:00Z",
  "version": 1,
  "source": "api",
  "payload": {}
}
```

`eventId` dùng để chống xử lý trùng. `version` dùng để thay đổi contract có kiểm soát.

## 13. Backend SignalR

Tạo hub riêng cho monitoring thay vì đưa mọi event vào NotificationHub:

```text
xmtruyen.API/Hubs/MonitoringHub.cs
```

Route:

```text
/hubs/monitoring
```

Nhóm connection:

- `admins`.
- `ops`.
- `moderators`.
- `finance`.

Không broadcast metrics server cho user thường.

Backend cần:

- `[Authorize(Roles = "Admin,SuperAdmin")]`.
- Group authorization.
- CancellationToken.
- Giới hạn payload.
- Không gửi stack trace hoặc secret.
- Không gửi raw user data nếu chỉ cần aggregate.

## 14. Điều chỉnh Nginx và server

Cần kiểm tra:

- WebSocket upgrade headers.
- Idle timeout.
- Proxy read timeout.
- HTTPS bắt buộc production.
- Sticky session nếu chạy nhiều API instance và chưa dùng backplane.
- Redis backplane khi có nhiều instance.
- CORS origin.
- Keep-alive.

Khi scale nhiều API instance:

```text
Client -> Load Balancer -> API instances
                         -> Redis backplane
                         -> SignalR clients
```

Nếu không có backplane, client có thể kết nối vào instance khác và không nhận event từ instance phát event.

## 15. Quyền setting

| Quyền | Được làm |
|---|---|
| Admin | Xem trạng thái realtime |
| Operator | Đổi interval trong phạm vi cho phép |
| SuperAdmin | Đổi transport, timeout, global config |
| User | Không được xem server metrics hoặc fraud metrics |

Mọi thay đổi cấu hình cần audit:

- Người thay đổi.
- Giá trị cũ.
- Giá trị mới.
- Thời gian.
- IP hoặc trace id.

## 16. Ngưỡng setting an toàn

```text
Health polling: 10-300 giây
Job polling: 2-60 giây
Metrics polling: 10-300 giây
Reconnect delay: 0-120 giây
Server timeout: 30-300 giây
Keep alive: 5-60 giây
```

Không cho `serverTimeoutMs` nhỏ hơn `2 * keepAliveIntervalMs` nếu backend dùng keep-alive bình thường.

Không cho polling interval quá ngắn trên toàn hệ thống. Với số page đang mở là `N`, request rate xấp xỉ:

```text
RequestsPerSecond = N / intervalSeconds
```

## 17. Kiểm thử bắt buộc

### Connection

- [ ] Kết nối WebSocket thành công.
- [ ] Fallback Server-Sent Events.
- [ ] Fallback Long Polling.
- [ ] Server restart.
- [ ] Network offline/online.
- [ ] Reconnect theo đúng delays.
- [ ] Không tạo connection trùng.
- [ ] Stop connection khi logout.

### Polling

- [ ] Setting 5 giây tạo request đúng kỳ vọng.
- [ ] Setting 30 giây không gọi dồn.
- [ ] Request trước chưa xong thì không gọi request mới.
- [ ] Tab hidden thì pause.
- [ ] Tab visible thì refetch một lần.
- [ ] API lỗi có backoff.
- [ ] Unmount hủy timer và request.

### Event

- [ ] Event không bị xử lý hai lần.
- [ ] Event cũ không ghi đè event mới.
- [ ] Event thiếu field được bỏ qua an toàn.
- [ ] Event version không tương thích được cảnh báo.
- [ ] Reconnect có refetch để bù event bị mất.

### Security

- [ ] User thường không kết nối monitoring hub.
- [ ] Admin không xem được dữ liệu ngoài quyền.
- [ ] Không gửi token trong log.
- [ ] Không gửi raw password/payment data.
- [ ] Thay đổi setting có audit log.

## 18. Lộ trình triển khai

### Phase 1 - Gom polling config

- [ ] Tạo `realtimeConfig.ts`.
- [ ] Tạo localStorage loader/validator.
- [ ] Thay hardcode 5/30 giây trong các page bằng config.
- [ ] Thêm Settings UI cơ bản.
- [ ] Dùng `setTimeout` recursive.

### Phase 2 - SignalR notification client

- [ ] Cài `@microsoft/signalr`.
- [ ] Tạo realtime service dùng chung.
- [ ] Kết nối `/hubs/notification`.
- [ ] Nhận `ReceiveNotification`.
- [ ] Thêm reconnect state.
- [ ] Tắt polling notification khi SignalR connected.

### Phase 3 - Monitoring hub

- [ ] Tạo `MonitoringHub`.
- [ ] Thêm authorization/group.
- [ ] Thêm event health, error, job và metrics.
- [ ] Tạo monitoring overview API.
- [ ] Đưa event qua Redis khi scale nhiều instance.

### Phase 4 - Dashboard integration

- [ ] Hiển thị connection status.
- [ ] Hiển thị last event time.
- [ ] Hiển thị polling fallback status.
- [ ] Thêm health/server metrics.
- [ ] Thêm error stream.
- [ ] Thêm job progress.

### Phase 5 - Production hardening

- [ ] Lưu config ở backend.
- [ ] Thêm audit log.
- [ ] Thêm rate limit.
- [ ] Load test connection.
- [ ] Kiểm tra memory leak.
- [ ] Kiểm tra nhiều tab cùng user.
- [ ] Kiểm tra nhiều API instance.
- [ ] Thiết lập alert khi reconnect tăng.

## 19. MVP khuyến nghị cho hệ thống hiện tại

Chưa cần làm SignalR cho mọi loại dữ liệu ngay.

Thứ tự nên làm:

1. Gom các interval polling hiện có vào một config.
2. Dùng SignalR cho notification vì backend đã có hub.
3. Dùng SignalR cho job progress.
4. Dùng polling 15-30 giây cho health/metrics.
5. Tạo monitoring hub riêng.
6. Thêm fraud và reading aggregate sau khi telemetry đủ tin cậy.

Cấu hình khởi đầu:

```json
{
  "mode": "hybrid",
  "healthPollingIntervalMs": 30000,
  "jobPollingIntervalMs": 5000,
  "metricsPollingIntervalMs": 15000,
  "reconnectDelaysMs": [0, 2000, 5000, 10000, 30000],
  "serverTimeoutMs": 60000,
  "keepAliveIntervalMs": 15000,
  "enableLongPollingFallback": true
}
```

## 20. Tiêu chí hoàn thành

- Có một nơi duy nhất để setting interval.
- Không còn hardcode interval realtime rải rác.
- Admin có thể đổi setting theo quyền.
- SignalR dùng một connection dùng chung.
- Polling chỉ chạy khi cần hoặc khi SignalR mất kết nối.
- Reconnect không tạo duplicate event.
- Tab ẩn không tạo request không cần thiết.
- Dashboard hiển thị trạng thái SignalR và polling fallback.
- Có audit log cho thay đổi cấu hình production.
- Có test connection, fallback, retry, duplicate event và permission.

## 21. Hướng dẫn làm từng bước

### Bước 1 - Cài SignalR client cho Admin

Chạy tại thư mục Admin:

```powershell
Push-Location .\xmtruyen-admin
npm install @microsoft/signalr
Pop-Location
```

Tạo các file:

```text
src/config/realtimeConfig.ts
src/services/realtimeService.ts
src/services/pollingService.ts
src/hooks/useRealtime.ts
src/contexts/RealtimeContext.tsx
```

Không tạo connection trong từng page. `RealtimeContext` phải quản lý một connection dùng chung cho toàn bộ Admin.

### Bước 2 - Cấu hình URL và transport

Thêm biến môi trường:

```text
VITE_API_URL=https://api.example.com/api
VITE_SIGNALR_URL=https://api.example.com/hubs
```

URL hub phải được tạo bằng cấu hình môi trường, không hardcode localhost.

```ts
const hubUrl = `${import.meta.env.VITE_SIGNALR_URL}/monitoring`;
```

Ưu tiên WebSocket. Chỉ bật Server-Sent Events và Long Polling làm fallback nếu Nginx/API hỗ trợ.

### Bước 3 - Tạo MonitoringHub ở backend

Tạo:

```text
xmtruyen.API/Hubs/MonitoringHub.cs
```

Hub cần:

```csharp
[Authorize(Roles = "Admin,SuperAdmin,Operator")]
public sealed class MonitoringHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
        await base.OnConnectedAsync();
    }
}
```

Đăng ký trong `Program.cs`:

```csharp
builder.Services.AddSignalR();
app.MapHub<MonitoringHub>("/hubs/monitoring");
```

Không dùng `NotificationHub` để broadcast server metrics. Notification và monitoring là hai nhóm quyền khác nhau.

### Bước 4 - Tạo event envelope thống nhất

Tất cả event phải có format:

```json
{
  "eventId": "uuid",
  "eventName": "ServerMetricsUpdated",
  "occurredAt": "2026-08-25T10:00:00Z",
  "version": 1,
  "source": "monitoring-agent",
  "payload": {}
}
```

Admin lưu `eventId` ngắn hạn để bỏ qua event trùng. Nếu event bị mất trong lúc reconnect, client phải gọi API snapshot để đồng bộ lại.

### Bước 5 - Tạo publisher backend

Không gọi `Clients.All` trực tiếp từ nhiều controller. Tạo interface:

```text
xmtruyen.API/Services/Realtime/IRealtimePublisher.cs
xmtruyen.API/Services/Realtime/SignalRRealtimePublisher.cs
```

Interface đề xuất:

```csharp
Task PublishHealthChangedAsync(HealthStatusChangedEvent payload, CancellationToken cancellationToken);
Task PublishServerMetricsAsync(ServerMetricsUpdatedEvent payload, CancellationToken cancellationToken);
Task PublishErrorCreatedAsync(ErrorCreatedEvent payload, CancellationToken cancellationToken);
Task PublishJobProgressAsync(JobProgressUpdatedEvent payload, CancellationToken cancellationToken);
Task PublishAlertAsync(AlertCreatedEvent payload, CancellationToken cancellationToken);
```

Publisher chịu trách nhiệm thêm envelope, chọn group và ghi log delivery. Controller chỉ gọi service nghiệp vụ.

## 22. Triển khai từng chức năng

### 22.1. Health check

Luồng:

```text
Health monitor chạy mỗi 10-30 giây
  -> kiểm tra PostgreSQL, worker, storage, API dependency
  -> chỉ phát event khi status hoặc response time thay đổi đáng kể
  -> Dashboard nhận HealthStatusChanged
  -> nếu mất SignalR, gọi GET /api/admin/health theo interval config
```

Không cần phát event mỗi giây. Health snapshot nên gồm status, latency, error message đã làm sạch và timestamp.

### 22.2. CPU, RAM, Disk và network

Tạo agent chạy trên VPS:

```text
monitoring-agent
  -> đọc CPU/RAM/Disk/Network
  -> gửi về Monitoring API mỗi 15-30 giây
  -> Monitoring service lưu aggregate
  -> phát ServerMetricsUpdated qua SignalR
```

Agent không được gửi secret hoặc raw process command chứa credential.

Payload chỉ nên gửi:

```json
{
  "serverId": "vps-01",
  "cpuPercent": 42.3,
  "memoryPercent": 58.1,
  "diskPercent": 61.2,
  "networkOutMbps": 4.8
}
```

### 22.3. API lỗi và Error Logs

Tạo middleware hoặc filter bắt exception:

```text
request
  -> API xử lý lỗi
  -> ghi ErrorEvent với fingerprint
  -> lưu database/log store
  -> publish ErrorCreated tới group admins/ops
```

Không gửi stack trace đầy đủ qua SignalR. Dashboard chỉ nhận fingerprint, severity, route đã che thông tin nhạy cảm, số lần lỗi và affected user count.

Khi một fingerprint lặp vượt ngưỡng, Alert rule engine phát `AlertCreated`.

### 22.4. Queue và Worker

Mỗi job cần có `jobId`, `jobType`, `status`, `progress`, `retryCount`, `updatedAt`.

Luồng:

```text
Worker nhận job
  -> publish JobProgressUpdated mỗi khi progress thay đổi đủ lớn hoặc sau 1-2 giây
  -> publish JobFailed khi lỗi
  -> publish JobCompleted khi xong
```

Không publish mỗi phần trăm nếu job có hàng nghìn bước. Có thể throttle event để tránh spam connection.

### 22.5. User online

Client gửi heartbeat:

```text
POST /api/presence/heartbeat
```

Mặc định 30-60 giây. Backend lưu `lastSeenAt` với TTL ngắn, không tạo một row mới cho mỗi heartbeat.

Dashboard nhận aggregate:

```json
{
  "onlineUsers": 42,
  "activeSessions": 48,
  "occurredAt": "2026-08-25T10:00:00Z"
}
```

Không broadcast danh sách user online đầy đủ nếu chỉ cần số lượng.

### 22.6. Người đang đọc

Reader gửi heartbeat theo session:

```text
POST /api/reading-sessions/{sessionId}/heartbeat
```

Dữ liệu gồm publication, chapter, progress, duration delta, device type và timestamp. Không gửi nội dung chapter.

Backend aggregate theo phút và phát `ReadingAggregateUpdated`. Dùng dữ liệu này cho concurrent readers và reading duration.

### 22.7. Click/request bất thường và fraud

Không tính fraud trực tiếp trong React. Luồng đúng:

```text
Request/click/reading/payment event
  -> event collector
  -> normalize + loại dữ liệu nhạy cảm
  -> risk rules/worker
  -> tính RiskScore có lý do
  -> lưu RiskEvent
  -> publish RiskScoreUpdated cho moderator/admin có quyền
```

Tín hiệu có thể dùng:

- Burst request.
- Nhiều request song song bất thường.
- Nhiều account dùng cùng mẫu session.
- Chapter mở nhưng duration gần bằng 0 lặp lại.
- Payment retry bất thường.

Không tự động khóa user chỉ vì một rule. Cần watch list, review thủ công, audit và trạng thái `NORMAL`, `WATCH`, `REVIEW`, `CONFIRMED_ABUSE`.

### 22.8. Thanh toán

Thanh toán phải bắt đầu từ webhook của payment provider:

```text
Payment provider
  -> POST /api/payments/webhook
  -> verify signature
  -> idempotency theo provider transaction id
  -> transaction database
  -> publish PaymentStatusChanged
  -> Admin cập nhật giao dịch
```

SignalR không thay thế webhook. Webhook là nguồn xác nhận thanh toán; SignalR chỉ cập nhật giao diện nhanh hơn.

Không gửi card data, secret, chữ ký hoặc raw webhook payload nhạy cảm qua SignalR.

### 22.9. Upload và Import

Luồng:

```text
Admin tạo import job
  -> upload file
  -> backend trả jobId
  -> worker xử lý
  -> publish ImportProgressUpdated
  -> publish ImportPreviewReady
  -> Admin review
  -> Admin confirm
  -> publish ImportCompleted hoặc ImportFailed
```

Progress event cần có tổng số dòng, dòng đã xử lý, lỗi, phần trăm và trạng thái. Không Apply dữ liệu vào database chỉ vì upload đã hoàn tất.

### 22.10. Cảnh báo hệ thống

Alert engine đọc metric và rule:

```text
metric vượt ngưỡng
  -> mở alert với fingerprint
  -> publish AlertCreated một lần
  -> giữ trạng thái alert
  -> khi trở lại bình thường publish AlertResolved
```

Phải có cooldown và deduplication để Dashboard không nhận hàng trăm cảnh báo giống nhau.

## 23. Polling fallback trong Hybrid mode

Mỗi resource cần biết mình đang dùng nguồn nào:

```text
source = signalr | polling | stale | unavailable
```

Quy tắc:

1. SignalR connected: nhận push, không polling cùng loại dữ liệu.
2. SignalR reconnecting: giữ dữ liệu cuối và hiển thị trạng thái reconnecting.
3. SignalR disconnected: bật polling theo setting.
4. SignalR reconnected: gọi snapshot API một lần.
5. Snapshot thành công: dừng polling fallback.
6. API lỗi: backoff và hiển thị stale data.

## 24. Cấu hình Nginx production

Nginx cần hỗ trợ WebSocket:

```nginx
location /hubs/ {
    proxy_pass http://xmtruyen_api;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

Production cần:

- HTTPS.
- CORS chỉ cho domain Admin hợp lệ.
- Authentication cho hub.
- Rate limit handshake nếu cần.
- Redis backplane khi có nhiều API instance.
- Kiểm tra idle timeout của load balancer.

## 25. Cách đo để biết realtime hoạt động thật

Dashboard phải hiển thị:

- `Connected`, `Reconnecting`, `Disconnected`.
- Transport hiện tại: WebSockets, SSE hoặc Long Polling.
- Thời điểm event gần nhất.
- Số lần reconnect.
- Event nhận/phút.
- Polling fallback đang bật hay tắt.
- Lỗi connection gần nhất.

Kiểm tra thủ công:

1. Mở DevTools Network.
2. Lọc `ws` và kiểm tra `/hubs/monitoring`.
3. Xác nhận connection giữ lâu, không phải request HTTP ngắn liên tục.
4. Tạo một error/job/notification test.
5. Xác nhận event đến Dashboard.
6. Tắt mạng rồi bật lại.
7. Xác nhận reconnect và snapshot bù dữ liệu.

## 26. Checklist áp dụng

### Nền tảng

- [ ] Cài `@microsoft/signalr`.
- [ ] Tạo config runtime.
- [ ] Tạo realtime service dùng chung.
- [ ] Tạo RealtimeContext.
- [ ] Tạo polling fallback.
- [ ] Thêm connection status vào UI.

### Backend

- [ ] Tạo MonitoringHub.
- [ ] Map hub trong Program.cs.
- [ ] Thêm authorization/group.
- [ ] Tạo event envelope.
- [ ] Tạo realtime publisher.
- [ ] Thêm deduplication và event version.
- [ ] Thêm monitoring snapshot API.

### Chức năng

- [ ] Health status.
- [ ] CPU/RAM/Disk/network.
- [ ] API errors.
- [ ] Error logs.
- [ ] Queue/worker.
- [ ] User presence.
- [ ] Reading presence.
- [ ] Risk/fraud events.
- [ ] Payment webhook.
- [ ] Upload/import progress.
- [ ] System alerts.

### Production

- [ ] Nginx WebSocket upgrade.
- [ ] HTTPS và CORS.
- [ ] Redis backplane nếu scale nhiều instance.
- [ ] Backup monitoring data.
- [ ] Retention policy.
- [ ] Alert cooldown.
- [ ] Load test.
- [ ] Chaos test reconnect.

## 27. Thứ tự làm phù hợp với Xóm Truyện hiện tại

1. Cài SignalR client và làm `RealtimeContext`.
2. Kết nối `NotificationHub` hiện có.
3. Tạo `MonitoringHub` riêng.
4. Làm event cho job upload/import/video/audio.
5. Làm health và server metrics.
6. Làm ErrorCreated và AlertCreated.
7. Làm user/reading heartbeat.
8. Làm payment webhook event.
9. Làm risk/fraud worker.
10. Thêm Redis backplane khi có nhiều API instance.

Với hệ thống chưa có nhiều user, chỉ cần một API instance, một MonitoringHub, polling fallback và database metrics cơ bản. Chưa cần Kafka hoặc kiến trúc event streaming lớn.
