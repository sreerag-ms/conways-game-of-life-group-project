import { InboxOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useSimulationControls } from '../../hooks/useSimulationControls';
import { processUploadedFile } from './constants';

const ImagePatternModal = ({ isVisible, onClose }) => {
  const { getGridDimensions, loadConfig, currentRules } = useSimulationControls();
  const { rows, cols } = getGridDimensions();

  const handleLoadConfig = (configData) => {
    const result = loadConfig(configData);
    if (result.success) {
      message.success('Pattern loaded successfully');
      onClose();
    } else {
      message.error(result.message);
    }
  };

  return (
    <Modal
      title="Image Pattern Editor"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-3 text-base font-medium"></h3>
          <p className="mb-3 text-sm text-gray-600">
            Upload an image to convert it into a game pattern. Dark pixels will become live cells.
          </p>
          <div className="flex flex-col gap-4">
            <Upload.Dragger
              accept="image/*"
              showUploadList={false}
              customRequest={({ file }) => {
                processUploadedFile(file, cols, rows, currentRules, handleLoadConfig);
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag an image file to this area</p>
              <p className="ant-upload-hint">
                The image will be scaled to fit the current grid size ({cols}x{rows})
              </p>
            </Upload.Dragger>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ImagePatternModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagePatternModal;
