import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Switch } from 'antd';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { useGameOfLife } from '../../hooks/useGameOfLife';

// Validation schema for grid settings
const gameSettingsValidationSchema = Yup.object().shape({
  rows: Yup.number()
    .required('Rows are required')
    .min(5, 'Minimum 5 rows')
    .max(1000, 'Maximum 1000 rows'),
  cols: Yup.number()
    .required('Columns are required')
    .min(5, 'Minimum 5 columns')
    .max(1000, 'Maximum 1000 columns'),
  isContinuous: Yup.boolean(),
});

const FormItemWithError = ({ label, name, touched, errors, children }) => (
  <Form.Item
    label={label}
    validateStatus={touched[name] && errors[name] ? 'error' : ''}
    help={touched[name] && errors[name]}
  >
    {children}
  </Form.Item>
);

const SettingsModal = ({
  isVisible,
  onClose,
}) => {
  const {
    rows,
    cols,
    isContinuous,
    createGrid,
    setContinuousGrid,
    clearGrid,
    saveConfig,
    loadConfig,
  } = useGameOfLife();

  const [configText, setConfigText] = useState('');
  const textAreaRef = useRef(null);

  // Form initialization
  const initialValues = {
    rows,
    cols,
    isContinuous,
  };

  // Form submission handler
  const handleSubmit = (values) => {
    // Update settings
    createGrid(values.rows, values.cols);
    setContinuousGrid(values.isContinuous);

    // Close the modal
    onClose();
  };

  // Pattern handlers
  const handleSaveConfig = () => {
    const config = saveConfig();
    setConfigText(config);
    message.success('Current grid saved to pattern editor');
  };

  const handleLoadConfig = () => {
    const result = loadConfig(configText);
    if (result.success) {
      message.success('Pattern loaded successfully');
      onClose();
    } else {
      message.error(result.message);
    }
  };

  return (
    <Modal
      title="Grid Settings"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <div className="flex flex-col gap-6">
        <Formik
          initialValues={initialValues}
          validationSchema={gameSettingsValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <div className='flex items-center justify-between mt-4 mb-4'>
                <FormItemWithError label="Rows" name="rows" touched={touched} errors={errors}>
                  <InputNumber
                    min={5}
                    max={1000}
                    value={values.rows}
                    onChange={(value) => setFieldValue('rows', value)}
                    className="w-full"
                  />
                </FormItemWithError>

                <FormItemWithError label="Columns" name="cols" touched={touched} errors={errors}>
                  <InputNumber
                    min={5}
                    max={1000}
                    value={values.cols}
                    onChange={(value) => setFieldValue('cols', value)}
                    className="w-full"
                  />
                </FormItemWithError>

                <Form.Item label="Continuous Grid">
                  <div className="flex items-center">
                    <Switch
                      checked={values.isContinuous}
                      onChange={(checked) => setFieldValue('isContinuous', checked)}
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      {values.isContinuous ? 'Edges wrap around' : 'Bounded edges'}
                    </span>
                  </div>
                </Form.Item>

              </div>
              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => {
                    clearGrid();
                    onClose();
                  }}
                  danger
                >
                  Clear Grid
                </Button>
                <Button type="primary" htmlType="submit">
                  Update Grid
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="pt-6 border-t">
          <h3 className="mb-3 text-base font-medium">Pattern Editor</h3>
          <p className="mb-3 text-sm text-gray-600">
            Use 0's and 1's to define your pattern. Each row must match the grid width.
          </p>
          <Input.TextArea
            ref={textAreaRef}
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            rows={6}
            placeholder="Initial configuration: use 0/1 rows"
            className="mb-4 font-mono"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveConfig}
            >
              Save Current Grid
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleLoadConfig}
            >
              Load Pattern
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
