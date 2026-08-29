import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { manualTopUp, type ManualTopUpRequest } from '../api/transactionApi';

interface ManualTopupModalProps {
  show: boolean;
  onHide: () => void;
  onCompleted: () => void;
}

export const ManualTopupModal: React.FC<ManualTopupModalProps> = ({ show, onHide, onCompleted }) => {
  const [form, setForm] = useState<ManualTopUpRequest>({ userId: '', amount: 0, coinAmount: 0, note: '', paymentMethod: 'Manual' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await manualTopUp(form);
      setForm({ userId: '', amount: 0, coinAmount: 0, note: '', paymentMethod: 'Manual' });
      onCompleted();
      onHide();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Nạp xu thủ công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control required value={form.userId} onChange={event => setForm({ ...form, userId: event.target.value })} placeholder="UUID người dùng" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số tiền (VNĐ)</Form.Label>
            <Form.Control type="number" min={0} value={form.amount} onChange={event => setForm({ ...form, amount: Number(event.target.value) })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số xu cộng</Form.Label>
            <Form.Control required type="number" min={1} value={form.coinAmount} onChange={event => setForm({ ...form, coinAmount: Number(event.target.value) })} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Hủy</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang xử lý...' : 'Nạp xu'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
