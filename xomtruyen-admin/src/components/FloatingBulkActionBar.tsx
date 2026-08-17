import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faPen, faExchangeAlt, faEye, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

interface FloatingBulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onSelectAll?: () => void;
  onBulkEdit?: () => void;
  onBulkStatusChange?: () => void;
  onBulkWatch?: () => void;
  onBulkDelete?: () => void;
}

export const FloatingBulkActionBar: React.FC<FloatingBulkActionBarProps> = ({ 
  selectedCount, 
  onClearSelection,
  onSelectAll,
  onBulkEdit,
  onBulkStatusChange,
  onBulkWatch,
  onBulkDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className="position-fixed shadow-lg jira-floating-action-bar"
      style={{
        bottom: '40px',
        left: 'calc(50% + 140px)',
        transform: 'translateX(-50%)',
        borderRadius: '8px',
        padding: '8px 12px',
        zIndex: 1050,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'background-color 0.2s, color 0.2s'
      }}
    >
      <div className="d-flex align-items-center ps-2">
        <span className="d-flex align-items-center justify-content-center selected-count" style={{ borderRadius: '4px', minWidth: '24px', height: '24px', padding: '0 6px', marginRight: '10px', fontSize: '13px', fontWeight: 'bold' }}>{selectedCount}</span>
        <span>selected</span>
      </div>

      <div className="action-item" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onClick={onSelectAll || onClearSelection}>
        <FontAwesomeIcon icon={faCheckDouble} className="me-2" />
        Select all
      </div>

      <div className="separator" style={{ width: '1px', height: '20px' }}></div>

      <div className="action-item" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onClick={onBulkEdit || (() => toast.error('Tính năng đang phát triển'))}>
        <FontAwesomeIcon icon={faPen} className="me-2" />
        Edit fields
      </div>
      <div className="action-item" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onClick={onBulkStatusChange || (() => toast.error('Tính năng đang phát triển'))}>
        <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
        Change status
      </div>
      <div className="action-item" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onClick={onBulkWatch || (() => toast.error('Tính năng đang phát triển'))}>
        <FontAwesomeIcon icon={faEye} className="me-2" />
        Watch options
      </div>
      <div className="action-item" style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} onClick={onBulkDelete || (() => toast.error('Tính năng đang phát triển'))}>
        <FontAwesomeIcon icon={faTrash} className="me-2" />
        Delete
      </div>

      <div className="separator" style={{ width: '1px', height: '20px' }}></div>

      <div className="pe-2 action-item" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', transition: 'color 0.2s' }} onClick={onClearSelection}>
         <FontAwesomeIcon icon={faXmark} size="lg" />
      </div>
    </div>
  );
};
