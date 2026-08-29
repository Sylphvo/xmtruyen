import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faChevronRight, faUsers, faBook, faBolt, 
  faCoins, faStar, faEye, faListOl, faCrown, faFileAlt, faImage
} from '@fortawesome/free-solid-svg-icons';
import { getOverviewStats, getTopPublications, getUsersChart, getRevenueChart, type OverviewStats, type TopPublication, type ChartSeries } from '../api/statsApi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [topPubs, setTopPubs] = useState<TopPublication[]>([]);
  const [revenueChart, setRevenueChart] = useState<ChartSeries>({ labels: [], data: [] });
  const [usersChart, setUsersChart] = useState<ChartSeries>({ labels: [], data: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [overview, topList, revenue, users] = await Promise.all([
        getOverviewStats(),
        getTopPublications(10),
        getRevenueChart(30),
        getUsersChart(30)
      ]);
      setStats(overview);
      setTopPubs(topList);
      setRevenueChart(revenue);
      setUsersChart(users);
    } catch (error) {
      toast.error('Không thể tải dữ liệu Dashboard');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center mb-4 text-muted small">
        <FontAwesomeIcon icon={faHome} style={{ fontSize: '14px' }} className="me-2" />
        <span>Trang chủ</span>
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '14px' }} className="mx-2" />
        <span className="text-white">Tổng quan</span>
      </div>

      <div className="row g-4 mb-4">
        {/* Doanh thu hôm nay */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="text-muted mb-0">Doanh thu hôm nay</h6>
                <div className="rounded-circle bg-success bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <FontAwesomeIcon icon={faCoins} className="text-success" />
                </div>
              </div>
              <h3 className="fw-bold mb-2 text-body">{stats.revenue.today.toLocaleString()} Xu</h3>
              <p className="text-muted small mb-0">Ngày {format(new Date(), 'dd MMMM, yyyy', { locale: vi })}</p>
            </div>
          </div>
        </div>

        {/* Tổng Users */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="text-muted mb-0">Tài khoản người dùng</h6>
                <div className="rounded-circle bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <FontAwesomeIcon icon={faUsers} className="text-primary" />
                </div>
              </div>
              <h3 className="fw-bold mb-2 text-body">{stats.users.total.toLocaleString()}</h3>
              <div className="d-flex justify-content-between text-muted small">
                <span><span className="text-success">{stats.users.active}</span> hoạt động</span>
                <span><span className="text-warning"><FontAwesomeIcon icon={faCrown} className="me-1"/>{stats.users.vip}</span> VIP</span>
              </div>
              <div className="mt-2 text-info small">+ {stats.users.newToday} tài khoản mới hôm nay</div>
            </div>
          </div>
        </div>

        {/* Tổng Truyện */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="text-muted mb-0">Truyện trên hệ thống</h6>
                <div className="rounded-circle bg-info bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <FontAwesomeIcon icon={faBook} className="text-info" />
                </div>
              </div>
              <h3 className="fw-bold mb-2 text-body">{stats.publications.total.toLocaleString()}</h3>
              <div className="d-flex justify-content-between text-muted small">
                <span><FontAwesomeIcon icon={faFileAlt} className="text-muted me-1"/> {stats.publications.text} truyện chữ</span>
                <span><FontAwesomeIcon icon={faImage} className="text-muted me-1"/> {stats.publications.comic} truyện tranh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng Chapters */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="text-muted mb-0">Tổng số chương</h6>
                <div className="rounded-circle bg-warning bg-opacity-10 p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <FontAwesomeIcon icon={faListOl} className="text-warning" />
                </div>
              </div>
              <h3 className="fw-bold mb-2 text-body">{(stats.chapters.totalBook + stats.chapters.totalComic).toLocaleString()}</h3>
              <div className="d-flex justify-content-between text-muted small">
                <span>Chữ: {stats.chapters.totalBook.toLocaleString()}</span>
                <span>Tranh: {stats.chapters.totalComic.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-header border-0 pb-0"><h6 className="mb-0">Doanh thu 30 ngày</h6></div>
            <div className="card-body">
              <Chart
                type="bar"
                height={280}
                options={{
                  chart: { toolbar: { show: false } },
                  xaxis: { categories: revenueChart.labels },
                  dataLabels: { enabled: false },
                  colors: ['#198754'],
                  yaxis: { labels: { formatter: value => value.toLocaleString('vi-VN') } }
                } as ApexOptions}
                series={[{ name: 'VNĐ', data: revenueChart.data }]}
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-header border-0 pb-0"><h6 className="mb-0">Người dùng mới 30 ngày</h6></div>
            <div className="card-body">
              <Chart
                type="line"
                height={280}
                options={{
                  chart: { toolbar: { show: false } },
                  xaxis: { categories: usersChart.labels },
                  dataLabels: { enabled: false },
                  stroke: { curve: 'smooth' },
                  colors: ['#5955D1'],
                  yaxis: { min: 0, forceNiceScale: true }
                } as ApexOptions}
                series={[{ name: 'Users', data: usersChart.data }]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Top 10 Truyện */}
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0"><FontAwesomeIcon icon={faBolt} className="text-warning me-2"/> Top 10 truyện được xem nhiều nhất</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead>
                    <tr>
                      <th className="text-muted" style={{ width: '50px' }}>#</th>
                      <th className="text-muted">Truyện</th>
                      <th className="text-muted text-end">Lượt xem</th>
                      <th className="text-muted text-end">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPubs.map((pub, index) => (
                      <tr key={pub.id}>
                        <td>
                          <span className={`badge ${index < 3 ? 'bg-danger' : 'bg-secondary'} rounded-circle`} style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {pub.coverImageUrl ? (
                              <>
                                <img 
                                  src={pub.coverImageUrl} 
                                  alt={pub.title} 
                                  className="rounded me-3" 
                                  style={{ width: '40px', height: '56px', minWidth: '40px', objectFit: 'cover' }} 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextSibling) {
                                      nextSibling.classList.remove('d-none');
                                      nextSibling.classList.add('d-flex');
                                    }
                                  }}
                                />
                                <div className="rounded me-3 bg-secondary d-none align-items-center justify-content-center" style={{ width: '40px', height: '56px', minWidth: '40px' }}>
                                  <FontAwesomeIcon icon={faBook} className="text-muted" />
                                </div>
                              </>
                            ) : (
                              <div className="rounded me-3 bg-secondary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '56px', minWidth: '40px' }}>
                                <FontAwesomeIcon icon={faBook} className="text-muted" />
                              </div>
                            )}
                            <div>
                              <h6 className="mb-0">{pub.title}</h6>
                              <span className="text-muted small">ID: {pub.id.substring(0, 8)}...</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          <FontAwesomeIcon icon={faEye} className="text-muted me-2 small" />
                          <span className="fw-bold">{pub.viewCount.toLocaleString()}</span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end align-items-center">
                            <span className="fw-bold me-1">{(pub.averageRating || 0).toFixed(1)}</span>
                            <FontAwesomeIcon icon={faStar} className="text-warning small" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {topPubs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-4">Chưa có dữ liệu</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Hướng dẫn nhanh */}
        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-header border-0 pb-0">
              <h6 className="mb-0">Quản trị nhanh</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <a href="/books" className="text-decoration-none">
                  <div className="p-3 rounded border border-secondary border-opacity-25 transition-all" style={{ backgroundColor: 'var(--hover-bg, rgba(0,0,0,0.03))' }}>
                    <div className="d-flex align-items-center">
                      <div className="rounded bg-primary bg-opacity-10 p-2 me-3">
                        <FontAwesomeIcon icon={faBook} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-body">Quản lý Sách</h6>
                        <p className="text-muted small mb-0">Thêm, sửa, xóa truyện và chương chữ</p>
                      </div>
                    </div>
                  </div>
                </a>
                
                <a href="/comics" className="text-decoration-none">
                  <div className="p-3 rounded border border-secondary border-opacity-25 transition-all" style={{ backgroundColor: 'var(--hover-bg, rgba(0,0,0,0.03))' }}>
                    <div className="d-flex align-items-center">
                      <div className="rounded bg-info bg-opacity-10 p-2 me-3">
                        <FontAwesomeIcon icon={faImage} className="text-info" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-body">Quản lý Truyện tranh</h6>
                        <p className="text-muted small mb-0">Đăng tải comic và quản lý file ảnh</p>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="/users" className="text-decoration-none">
                  <div className="p-3 rounded border border-secondary border-opacity-25 transition-all" style={{ backgroundColor: 'var(--hover-bg, rgba(0,0,0,0.03))' }}>
                    <div className="d-flex align-items-center">
                      <div className="rounded bg-success bg-opacity-10 p-2 me-3">
                        <FontAwesomeIcon icon={faUsers} className="text-success" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-body">Quản lý Người dùng</h6>
                        <p className="text-muted small mb-0">Khóa tài khoản, xem thống kê user</p>
                      </div>
                    </div>
                  </div>
                </a>

                <a href="/transactions" className="text-decoration-none">
                  <div className="p-3 rounded border border-secondary border-opacity-25 transition-all" style={{ backgroundColor: 'var(--hover-bg, rgba(0,0,0,0.03))' }}>
                    <div className="d-flex align-items-center">
                      <div className="rounded bg-warning bg-opacity-10 p-2 me-3">
                        <FontAwesomeIcon icon={faCoins} className="text-warning" />
                      </div>
                      <div>
                        <h6 className="mb-1 text-body">Doanh thu & Giao dịch</h6>
                        <p className="text-muted small mb-0">Kiểm tra lịch sử nạp xu, mua gói VIP</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
