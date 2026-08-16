import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit, Trash, Plus, Flame } from 'lucide-react';
import * as api from '../api/coinPackageApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';

export const CoinPackages: React.FC = () => {
  const [packages, setPackages] = useState<api.CoinPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(packages.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const [formData, setFormData] = useState<api.SaveCoinPackageRequest>({
    name: '',
    coinAmount: 0,
    bonusCoins: 0,
    priceVND: 0,
    isPopular: false,
    isActive: true,
    orderIndex: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getAllCoinPackages();
      setPackages(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách gói xu');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (pkg?: api.CoinPackage) => {
    if (pkg) {
      setEditingId(pkg.id);
      setFormData({
        name: pkg.name,
        coinAmount: pkg.coinAmount,
        bonusCoins: pkg.bonusCoins,
        priceVND: pkg.priceVND,
        isPopular: pkg.isPopular,
        isActive: pkg.isActive,
        orderIndex: pkg.orderIndex
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        coinAmount: 100,
        bonusCoins: 0,
        priceVND: 10000,
        isPopular: false,
        isActive: true,
        orderIndex: packages.length
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCoinPackage(editingId, formData);
        toast.success('Cập nhật gói xu thành công');
      } else {
        await api.createCoinPackage(formData);
        toast.success('Thêm gói xu thành công');
      }
      handleCloseModal();
      fetchPackages();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu gói xu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói xu này?')) return;
    
    try {
      await api.deleteCoinPackage(id);
      toast.success('Xóa gói xu thành công');
      fetchPackages();
    } catch (error) {
      toast.error('Lỗi khi xóa gói xu');
    }
  };

  const handleImportExcel = async (importedData: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    
    setLoading(true);
    for (const row of importedData) {
      const name = row.name || row.Name || row['Tên Gói'];
      const coinAmount = Number(row.coinAmount || row.CoinAmount || row['Xu Gốc']) || 0;
      const bonusCoins = Number(row.bonusCoins || row.BonusCoins || row['Xu Thưởng (Bonus)']) || 0;
      const priceVND = Number(row.priceVND || row.PriceVND || row['Giá Tiền (VNĐ)']) || 0;
      
      if (!name) continue;
      
      try {
        await api.saveCoinPackage({
          name,
          coinAmount,
          bonusCoins,
          priceVND,
          isPopular: false,
          isActive: true
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} gói xu`);
      fetchPackages();
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} gói xu`);
    }
  };

  return (
    <>
      <div className="jira-table-container m-4">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Gói Xu</h5>
        <div className="d-flex gap-2 align-items-center">
          <ExcelActionButtons 
            dataToExport={packages.map(p => ({
              'ID': p.id,
              'Tên Gói': p.name,
              'Xu Gốc': p.coinAmount,
              'Xu Thưởng (Bonus)': p.bonusCoins,
              'Giá Tiền (VNĐ)': p.priceVND,
              'Trạng thái': p.isActive ? 'Đang hoạt động' : 'Đã ẩn'
            }))}
            exportFileName="CoinPackages"
            onImport={handleImportExcel}
            isLoading={loading}
          />
          <Button variant="primary" size="sm" onClick={() => handleShowModal()}>
            <Plus size={16} className="me-2" />
            Thêm Gói Mới
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    checked={packages.length > 0 && selectedIds.length === packages.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < packages.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </ResizableHeader>
                <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Tên Gói</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Xu Gốc</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Xu Thưởng (Bonus)</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Giá Tiền (VNĐ)</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Trạng thái</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thao tác</span>
                </ResizableHeader>
              </tr>
            </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(pkg.id) ? '#ebf2fc' : 'transparent' }}>
                    <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(pkg.id)}
                        onChange={() => toggleSelect(pkg.id)}
                      />
                    </td>
                    <td className="fw-bold" style={{ padding: '12px 16px' }}>
                      {pkg.name}
                      {pkg.isPopular && <Badge bg="danger" className="ms-2"><Flame size={12} className="me-1"/>Hot</Badge>}
                    </td>
                    <td className="text-warning fw-bold" style={{ padding: '12px 16px' }}>{pkg.coinAmount.toLocaleString()} Xu</td>
                    <td className="text-success" style={{ padding: '12px 16px' }}>+{pkg.bonusCoins.toLocaleString()} Xu</td>
                    <td style={{ padding: '12px 16px' }}>{pkg.priceVND.toLocaleString()} đ</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge bg={pkg.isActive ? 'success' : 'secondary'}>
                        {pkg.isActive ? 'Đang bán' : 'Tạm ẩn'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowModal(pkg)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(pkg.id)}>
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>Chưa có gói xu nào</h4>
                        <p>Bấm "Thêm Gói Mới" để tạo gói nạp xu đầu tiên.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>{editingId ? 'Sửa Gói Xu' : 'Thêm Gói Xu'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'transparent' }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên gói (VD: Gói Khởi Động)</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>
            
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Xu Nhận (Coin)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="coinAmount" 
                    value={formData.coinAmount} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Xu Tặng Thêm (Bonus)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="bonusCoins" 
                    value={formData.bonusCoins} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Giá Bán (VNĐ)</Form.Label>
              <Form.Control 
                type="number" 
                name="priceVND" 
                value={formData.priceVND} 
                onChange={handleChange} 
                required 
                min="0"
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thứ tự hiển thị (Order Index)</Form.Label>
              <Form.Control 
                type="number" 
                name="orderIndex" 
                value={formData.orderIndex} 
                onChange={handleChange} 
                required 
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>

            <div className="d-flex gap-4">
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  name="isPopular"
                  label="Đánh dấu HOT (Popular)"
                  checked={formData.isPopular}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  name="isActive"
                  label="Đang bán (Active)"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderTopColor: 'var(--bs-border-color)' }}>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu lại</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
