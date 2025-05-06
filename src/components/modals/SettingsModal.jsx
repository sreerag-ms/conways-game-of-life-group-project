import { Button, Form, InputNumber, Modal, Select, Switch } from 'antd';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCanvasStore } from '../../hooks/canvasStore';
import { RULES } from '../../hooks/constants';
import { useGameStore } from '../../hooks/gameStore';
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
    isContinuous,
    getGridDimensions,
    createGrid,
    setContinuousGrid,
    clearGrid,
    changeRules,
    currentRules,
  } = useGameStore(
    useShallow((state) => ({
      isContinuous: state.isContinuous,
      createGrid: state.createGrid,
      getGridDimensions: state.getGridDimensions,
      setContinuousGrid: state.setContinuousGrid,
      clearGrid: state.clearGrid,
      changeRules: state.changeRules,
      currentRules: state.currentRules,
    })));

  const {
    resetView,
  } = useCanvasStore();

  const { rows, cols } = getGridDimensions();

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
    resetView();
    onClose();
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
          <Form layout="vertical" onFinish={handleSubmit} className="mb-0">
            <div className="grid grid-cols-3 gap-4">
              <FormItemWithError label="Rows" name="rows" touched={touched} errors={errors}>
                <InputNumber
                  min={5}
                  max={5000}
                  value={values.rows}
                  onChange={(value) => setFieldValue('rows', value)}
                  className="w-full"
                  style={{ width: '100%' }}
                />
              </FormItemWithError>

              <FormItemWithError label="Columns" name="cols" touched={touched} errors={errors}>
                <InputNumber
                  min={5}
                  max={5000}
                  value={values.cols}
                  onChange={(value) => setFieldValue('cols', value)}
                  className="w-full"
                  style={{ width: '100%' }}
                />
              </FormItemWithError>

              <Form.Item label="Continuous Grid" className="mb-0">
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

            <div className="mb-4 text-xs text-gray-500">
              <p>Note: Cell size will automatically adjust based on grid dimensions. Smaller grids will have larger cells.</p>
            </div>

            <FormItemWithError label="Rule Set" name="currentRules" touched={touched} errors={errors}>
              <Select
                value={values.currentRules}
                onChange={(value) => setFieldValue('currentRules', value)}
                className="w-full"
              >
                {Object.keys(RULES).map(ruleKey => (
                  <Select.Option key={ruleKey} value={ruleKey}>
                    {RULES[ruleKey].name} - S: [{RULES[ruleKey].S.join(',')}], B: [{RULES[ruleKey].B.join(',')}]
                  </Select.Option>
                ))}
              </Select>
              <div className="mt-1 text-xs text-gray-500">
                S = Survival conditions, B = Birth conditions
              </div>
            </FormItemWithError>

            <div className="flex justify-between pt-2">
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
    </Modal>
  );
};

SettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
