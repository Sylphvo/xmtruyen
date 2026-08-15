import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

interface ExcelActionButtonsProps {
  dataToExport: any[];
  exportFileName?: string;
  onImport?: (data: any[]) => void;
  isLoading?: boolean;
}

export const ExcelActionButtons: React.FC<ExcelActionButtonsProps> = ({
  dataToExport,
  exportFileName = 'ExportData',
  onImport,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Lấy sheet đầu tiên
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sang JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData && jsonData.length > 0) {
          if (onImport) {
            onImport(jsonData);
          }
        } else {
          toast.error('File Excel không có dữ liệu');
        }
      } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        toast.error('Có lỗi xảy ra khi đọc file Excel');
      } finally {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      toast.error('Không thể đọc file');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <Button 
        variant="success" 
        size="sm" 
        onClick={handleExport}
        disabled={isLoading || !dataToExport || dataToExport.length === 0}
        className="d-flex align-items-center gap-2 rounded-2"
        style={{ backgroundColor: '#217346', borderColor: '#217346' }} // Màu chuẩn của Excel
      >
        <FontAwesomeIcon icon={faDownload} />
        Xuất
      </Button>

      {onImport && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
          />
          <Button 
            variant="outline-success" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="d-flex align-items-center gap-2 rounded-2"
          >
            <FontAwesomeIcon icon={faUpload} />
            Nhập
          </Button>
        </>
      )}
    </div>
  );
};
