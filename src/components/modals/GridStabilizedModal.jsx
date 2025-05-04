import { Modal, Typography } from 'antd';
import React from 'react';

const GridStabilizedModal = ({ isOpen, onClose }) => (
  <Modal
    open={isOpen}
    onOk={onClose}
    onCancel={onClose}
    centered
    footer={null}
    width={360}
    bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
  >
    <div className="flex flex-col items-center">
      <div className="mb-4 text-3xl">🎉</div>
      <Typography.Title level={4} style={{ marginBottom: 8 }}>
        Grid Stabilized
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        No more changes will occur. <br />
        Try a new pattern or reset the grid!
      </Typography.Paragraph>
      <button
        className="px-6 py-2 mt-6 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  </Modal>
);

export default GridStabilizedModal;
