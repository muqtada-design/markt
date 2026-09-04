import React from 'react';
import { Modal } from '../common/Modal';
import { CameraScanner } from './CameraScanner';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  onDetected,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مسح الباركود بالكاميرا">
      <div style={{ padding: '8px 0' }}>
        <CameraScanner
          onScanSuccess={(code) => {
            onDetected(code);
            onClose();
          }}
        />
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          ضع الباركود داخل الإطار ليتم التعرف عليه تلقائياً
        </p>
      </div>
    </Modal>
  );
};
