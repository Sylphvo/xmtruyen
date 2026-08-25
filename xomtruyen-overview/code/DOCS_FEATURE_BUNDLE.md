# Docs Tab - Code Bundle

File này gom các phần code cần thiết của tính năng `Docs` theo từng trang quản lý. Code đang được tách trong source để ứng dụng dễ bảo trì; file này dùng làm bản triển khai/copy khi cần.

## 1. Files trong source

- `src/pages/Docs.tsx`: giao diện, filter, sort, create/edit/delete và localStorage.
- `src/components/layout/AppLayout.tsx`: chuyển nội dung sang Docs khi URL có `?view=docs`.
- `src/components/layout/Breadcrumbs.tsx`: tab `List` và `Docs`, giữ nguyên pathname hiện tại.
- `src/assets/scss/app.scss`: style bảng Docs responsive.
- `src/App.tsx`: đăng ký route `/docs` dự phòng.

## 2. AppLayout integration

```tsx
import { Outlet, useLocation } from 'react-router-dom';
import { Docs } from '../../pages/Docs';

const location = useLocation();
const isDocsView = new URLSearchParams(location.search).get('view') === 'docs';

// Trong <main className="app-content">
<Breadcrumbs />
{isDocsView ? <Docs /> : <Outlet />}
```

## 3. Breadcrumb tabs integration

```tsx
import { Link, useLocation } from 'react-router-dom';

const activeTab = new URLSearchParams(location.search).get('view') === 'docs'
  ? 'Docs'
  : 'List';
const listUrl = location.pathname === '/docs' ? '/all-books' : location.pathname;
const docsUrl = `${listUrl}?view=docs`;

<Link to={tab.name === 'Docs' ? docsUrl : listUrl}>
  <tab.icon size={16} />
  {tab.name}
  {activeTab === tab.name && <div className="docs-tab-active" />}
</Link>
```

## 4. Docs page contract

```tsx
type DocStatus = 'DRAFT' | 'PUBLISHED';
type DocType = 'Tài liệu nghiệp vụ' | 'API reference' | 'Hướng dẫn';

interface DocItem {
  id: string;
  title: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  status: DocStatus;
  type: DocType;
  content: string;
}
```

`Docs.tsx` hiện có các chức năng:

- Lấy workspace theo pathname: Books, Comics, Users, Database, Categories, Topics, Authors, Transactions, Notifications.
- Search theo title và content.
- Filter theo loại tài liệu.
- Sort theo ngày cập nhật.
- Create/Edit/Delete bằng modal.
- Lưu tạm bằng key `xomtruyen-admin-docs` trong `localStorage`.
- Responsive table và empty state.

## 5. LocalStorage to API replacement

Thay phần khởi tạo state hiện tại bằng API client sau khi backend sẵn sàng:

```tsx
const [docs, setDocs] = useState<DocItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadDocs = async () => {
    try {
      setIsLoading(true);
      const response = await docsApi.list({
        resource: location.pathname,
        search: query,
        type: typeFilter === 'ALL' ? undefined : typeFilter
      });
      setDocs(response.data);
    } catch {
      setError('Không thể tải tài liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  void loadDocs();
}, [location.pathname, query, typeFilter]);
```

## 6. Route behavior

| Màn hình | List | Docs |
|---|---|---|
| Sách | `/books` | `/books?view=docs` |
| Truyện tranh | `/comics` | `/comics?view=docs` |
| Users | `/users` | `/users?view=docs` |
| Database | `/database` | `/database?view=docs` |
| Categories | `/categories` | `/categories?view=docs` |
| Topics | `/topics` | `/topics?view=docs` |

## 7. Production API shape

```ts
export interface DocsListParams {
  resource: string;
  search?: string;
  type?: DocType;
  status?: DocStatus;
  page?: number;
  pageSize?: number;
}

export interface DocsListResponse {
  data: DocItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const docsApi = {
  list: (params: DocsListParams) => apiClient.get<DocsListResponse>('/admin/docs', { params }),
  get: (id: string) => apiClient.get<DocItem>(`/admin/docs/${id}`),
  create: (payload: Partial<DocItem>) => apiClient.post<DocItem>('/admin/docs', payload),
  update: (id: string, payload: Partial<DocItem>) => apiClient.put<DocItem>(`/admin/docs/${id}`, payload),
  remove: (id: string) => apiClient.delete(`/admin/docs/${id}`)
};
```

## 8. Validation

```powershell
Push-Location .\xomtruyen-admin
npm run lint
npm run build
Pop-Location
```

Bản MVP hiện tại không cần API/database. Khi triển khai thật, thay `localStorage` bằng `docsApi`, thêm authorization, Markdown sanitizer, versioning và audit log theo [DOCS_IMPLEMENTATION_TASKS.md](DOCS_IMPLEMENTATION_TASKS.md).
