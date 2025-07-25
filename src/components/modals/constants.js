import * as Yup from 'yup';
import { imageToPattern } from '../../utils/patterns';

// Validation schema for grid settings
export const gameSettingsValidationSchema = Yup.object().shape({
  rows: Yup.number()
    .required('Rows are required')
    .min(5, 'Minimum 5 rows')
    .max(3000, 'Maximum 3000 rows'),
  cols: Yup.number()
    .required('Columns are required')
    .min(5, 'Minimum 5 columns')
    .max(3000, 'Maximum 3000 columns'),
  isContinuous: Yup.boolean(),
  currentRules: Yup.string().required('Rule set is required'),
});

export const createConfigFromPattern = (pattern, rows, cols, rules) => ({
  cells: pattern.cells.flatMap((row, i) =>
    row.map((cell, j) => cell === 1 ? `${i},${j}` : null),
  ).filter(Boolean),
  rows,
  cols,
  rules,
});

export const processUploadedFile = (file, cols, rows, rules, onComplete) => {
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
