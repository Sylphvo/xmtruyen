import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { MoreHorizontal } from 'lucide-react';
import { ImportExcelModal } from './ImportExcelModal';

interface ExcelActionButtonsProps {
  dataToExport: any[];
  exportFileName?: string;
  onImport?: (data: any[]) => void;
  isLoading?: boolean;
  onRefresh?: () => void; // Keeping it in interface to not break pages that still pass it
}

const CustomToggle = React.forwardRef<HTMLButtonElement, { children: React.ReactNode, onClick: (e: React.MouseEvent) => void, disabled?: boolean }>(
  ({ children, onClick, disabled }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      disabled={disabled}
      className="btn btn-light btn-sm d-flex align-items-center justify-content-center border shadow-sm bg-white"
      style={{ width: '32px', height: '32px', padding: 0 }}
    >
      {children}
    </button>
  )
);
CustomToggle.displayName = 'CustomToggle';

export const ExcelActionButtons: React.FC<ExcelActionButtonsProps> = ({
  dataToExport,
  exportFileName = 'ExportData',
  onImport,
  isLoading = false
}) => {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExport = () => {
    if (!dataToExport || dataToExport.length === 0) {
      toast.error('Không có dữ liệu để xuất Excel');
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      const fileName = `${exportFileName}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      toast.success('Đã xuất file Excel thành công');
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      toast.error('Có lỗi xảy ra khi xuất file Excel');
    }
  };

  const handleImportClick = () => {
    if (onImport) {
      setShowImportModal(true);
    } else {
      toast.error('Chức năng import đang được phát triển');
    }
  };

  return (
    <>
      <Dropdown align="end" className="ms-auto">
        <Dropdown.Toggle as={CustomToggle} disabled={isLoading}>
          <MoreHorizontal size={16} />
        </Dropdown.Toggle>

        <Dropdown.Menu className="shadow-sm border-0 py-2">
          <Dropdown.Item onClick={handleExport} disabled={!dataToExport || dataToExport.length === 0} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faDownload} className="me-2 text-success" />
            Xuất Excel
          </Dropdown.Item>
          <Dropdown.Item onClick={handleImportClick} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
            <FontAwesomeIcon icon={faUpload} className="me-2 text-primary" />
            Nhập Excel
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {showImportModal && onImport && (
        <ImportExcelModal
          show={showImportModal}
          onHide={() => setShowImportModal(false)}
          onConfirm={(data) => {
            onImport(data);
            setShowImportModal(false);
          }}
        />
      )}
    </>
  );
};
