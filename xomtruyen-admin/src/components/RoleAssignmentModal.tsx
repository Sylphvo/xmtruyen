import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { assignRole, getRoles, type Role } from '../api/roleApi';

interface RoleAssignmentModalProps {
  show: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({ show, userId, userName, onClose, onSuccess }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchRoles();
      setSelectedRoleId('');
      setReason('');
    }
  }, [show]);

  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error: any) {
      console.error('Lỗi khi lấy vai trò:', error);
      toast.error('Không thể tải danh sách vai trò');
    } finally {
      setRolesLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedRoleId) {
      toast.error('Vui lòng chọn vai trò');
      return;
    }

    setLoading(true);
    try {
      await assignRole(userId, {
        roleId: Number(selectedRoleId),
        reason: reason || undefined
      });
      toast.success(`Đã gán vai trò cho ${userName}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Lỗi khi gán vai trò:', error);
      toast.error(error.message || 'Không thể gán vai trò');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gán Vai Trò</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label fw-semibold">Người dùng</label>
          <input type="text" className="form-control" value={`${userName} (${userId})`} disabled />
        </div>

        <div className="mb-3">
          <label htmlFor="roleSelect" className="form-label fw-semibold">
            Chọn vai trò <span className="text-danger">*</span>
          </label>
          {rolesLoading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span className="text-muted small">Đang tải...</span>
            </div>
          ) : (
            <Form.Select
              id="roleSelect"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : '')}
              className="form-control"
            >
              <option value="">-- Chọn vai trò --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} {role.description ? `(${role.description})` : ''}
                </option>
              ))}
            </Form.Select>
          )}
        </div>

        <div className="mb-0">
          <label htmlFor="reasonTextarea" className="form-label fw-semibold">
            Lý do (tùy chọn)
          </label>
          <Form.Control
            id="reasonTextarea"
            as="textarea"
            rows={3}
            placeholder="Nhập lý do gán vai trò..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-control"
          />
          <small className="text-muted d-block mt-1">Lý do sẽ được ghi lại trong audit log</small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleAssign} disabled={loading || rolesLoading || !selectedRoleId}>
          {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
          Gán Vai Trò
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
