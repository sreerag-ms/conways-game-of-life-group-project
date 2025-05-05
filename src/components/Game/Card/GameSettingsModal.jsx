import { Button, Form, InputNumber, Modal, Switch } from 'antd';
import { Formik } from 'formik';
import React from 'react';
import { gameSettingsValidationSchema } from './validation';

const FormItemWithError = ({ label, name, touched, errors, children }) => (
  <Form.Item
    label={label}
    validateStatus={touched[name] && errors[name] ? 'error' : ''}
    help={touched[name] && errors[name]}
  >
    {children}
  </Form.Item>
);

const GameSettingsModal = ({
  isVisible,
  onClose,
  rows,
  cols,
  isContinuous,
  onGenerate,
  setContinuousGrid,
  onClear,
}) => {
  const initialValues = {
    rows,
    cols,
    isContinuous,
  };

  const handleSubmit = (values) => {
    // Update settings
    onGenerate(values.rows, values.cols);
    setContinuousGrid(values.isContinuous);

    // Close the modal
    onClose();
  };

  return (
    <Modal
      title="Edit Game Settings"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={400}
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
          <Form layout="vertical" onFinish={handleSubmit}>
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

            <div className="flex justify-between mt-6">
              <Button
                onClick={() => {
                  onClear();
                  onClose();
                }}
                danger
              >
                Clear Grid
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default GameSettingsModal;
