import React from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function TitleInput({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <TextField
      fullWidth
      label={t('title')}
      variant="outlined"
      size="large"
      value={value}
      onChange={onChange}
      InputProps={{
        style: { fontSize: '1rem'}, // 输入内容加大
      }}
      InputLabelProps={{
        style: { fontSize: '1rem' }, // Label 文字变大
      }}
      sx={{
        borderRadius: 2, // 让输入框的边框更圆滑
      }}
    />
  );
}

export default TitleInput;
