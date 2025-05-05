import { Button, Form, InputNumber, message, Modal, Select, Switch } from 'antd';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { RULES } from '../../hooks/constants';
import { useSimulationControls } from '../../hooks/useSimulationControls';
import { gameSettingsValidationSchema } from './constants';

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
    getGridDimensions,
    createGrid,
    setContinuousGrid,
    clearGrid,
    loadConfig,
    changeRules,
  } = useSimulationControls();

  const { rows, cols } = getGridDimensions();

  // Form initialization
  const [isContinuous, currentRules] = [
    // These are not in getGridDimensions, so fetch from store directly
    useSimulationControls().isContinuous,
    useSimulationControls().currentRules,
  ];

  const initialValues = {
    rows,
    cols,
    isContinuous,
    currentRules,
  };

  // Form submission handler
  const handleSubmit = (values) => {
    createGrid(values.rows, values.cols);
    setContinuousGrid(values.isContinuous);
    changeRules(values.currentRules);
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
      </div>
    </Modal>
  );
};

SettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
