import * as Yup from 'yup';

export const gameSettingsValidationSchema = Yup.object().shape({
  rows: Yup.number()
    .required('Rows are required')
    .min(5, 'Rows should be at least 5')
    .max(1000, 'Rows should be at most 1000')
    .integer('Rows must be a whole number'),
  cols: Yup.number()
    .required('Columns are required')
    .min(5, 'Columns should be at least 5')
    .max(1000, 'Columns should be at most 1000')
    .integer('Columns must be a whole number'),
  isContinuous: Yup.boolean(),
});
