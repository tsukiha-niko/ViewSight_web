import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select } from '@mui/material';
import i18n from '../i18n'; // 关键：从 i18n 实例中导入，而不是从 react-i18next

const LanguageSwitcher = () => {
  const { i18n: i18nextInstance } = useTranslation();

  useEffect(() => {
    // 在组件挂载时，检查 localStorage 是否有存储的语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18nextInstance.language) {
      i18nextInstance.changeLanguage(savedLanguage);
    }
  }, [i18nextInstance]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage); // 存储到 localStorage
  };

  return (
    <Select
      value={i18nextInstance.language}
      onChange={handleLanguageChange}
      variant="outlined"
      size="small"
      sx={{ color: 'white', borderColor: 'white' }}
    >
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="zh">中文</MenuItem>
    </Select>
  );
};

export default LanguageSwitcher;
