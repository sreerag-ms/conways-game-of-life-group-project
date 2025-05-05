import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, message, Modal, Select, Switch, Upload } from 'antd';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import * as Yup from 'yup';
import { RULES } from '../../hooks/constants';
import { useGameOfLife } from '../../hooks/useGameOfLife';
import { imageToPattern } from '../../utils/patterns';

// Convert pattern cells to config format
const createConfigFromPattern = (pattern, rows, cols, rules) => ({
  cells: pattern.cells.flatMap((row, i) => 
    row.map((cell, j) => cell === 1 ? `${i},${j}` : null)
  ).filter(Boolean),
  rows,
  cols,
  rules,
});

// Process uploaded image
const processUploadedFile = (file, cols, rows, rules, onComplete) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const pattern = imageToPattern(img, cols, rows);
      const configData = createConfigFromPattern(pattern, rows, cols, rules);
      onComplete(configData);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

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
  currentRules: Yup.string().required('Rule set is required'),
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

FormItemWithError.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

const SettingsModal = ({
  isVisible,
  onClose,
}) => {
  const {
    rows,
    cols,
    isContinuous,
    currentRules,
    createGrid,
    setContinuousGrid,
    clearGrid,
    loadConfig,
    changeRules,
  } = useGameOfLife();

  // Form initialization
  const initialValues = {
    rows,
    cols,
    isContinuous,
    currentRules,
  };

  // Form submission handler
  const handleSubmit = (values) => {
    // Update settings
    createGrid(values.rows, values.cols);
    setContinuousGrid(values.isContinuous);
    changeRules(values.currentRules);

    // Close the modal
    onClose();
  };

  // Pattern handlers
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
              <div className='flex flex-wrap items-start justify-between gap-4 mt-4 mb-4'>
                <FormItemWithError label="Rows" name="rows" touched={touched} errors={errors} className="w-1/3">
                  <InputNumber
                    min={5}
                    max={1000}
                    value={values.rows}
                    onChange={(value) => setFieldValue('rows', value)}
                    className="w-full"
                  />
                </FormItemWithError>

                <FormItemWithError label="Columns" name="cols" touched={touched} errors={errors} className="w-1/3">
                  <InputNumber
                    min={5}
                    max={1000}
                    value={values.cols}
                    onChange={(value) => setFieldValue('cols', value)}
                    className="w-full"
                  />
                </FormItemWithError>

                <Form.Item label="Continuous Grid" className="w-1/3">
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

                <FormItemWithError label="Rule Set" name="currentRules" touched={touched} errors={errors} className="w-full">
                  <Select
                    value={values.currentRules}
                    onChange={(value) => setFieldValue('currentRules', value)}
                    className="w-full"
                  >
                    {Object.keys(RULES).map(ruleKey => (
                      <Select.Option key={ruleKey} value={ruleKey}>
                        {RULES[ruleKey].name} ({ruleKey}) - S: [{RULES[ruleKey].S.join(',')}], B: [{RULES[ruleKey].B.join(',')}]
                      </Select.Option>
                    ))}
                  </Select>
                  <div className="mt-1 text-xs text-gray-500">
                    S = Survival conditions, B = Birth conditions
                  </div>
                </FormItemWithError>
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
          <h3 className="mb-3 text-base font-medium">Image Pattern Editor</h3>
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

SettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
