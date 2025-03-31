import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Grid, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

function SettingsDialog({ open, onClose }) {
  const { t } = useTranslation();

  const defaultSettings = {
    backendUrl: '',
    aiServerUrl: '',
    cookie: '',
    textUrl: '',
    textToken: '',
    textModel: '',
    videoUrl: '',
    videoToken: '',
    videoModel: '',
    imageUrl: '',
    imageToken: '',
    imageModel: ''
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' 为绿色，'error' 为红色
  const fileInputRef = useRef(null); // 用于触发文件选择

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('解析 localStorage 中的设置失败：', error);
        setSettings(defaultSettings);
      }
    }
  }, [open]);

  // 处理输入框变化
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value
    }));
  };

  // 一键导出配置项到剪贴板
  const handleExportToClipboard = async () => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2);
      await navigator.clipboard.writeText(settingsJson);
      setSnackbarMessage(t('exportClipboardSuccess')); // "配置已成功导出到剪贴板！"
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('导出到剪贴板失败：', error);
      setSnackbarMessage(t('exportClipboardFailed', { error: error.message })); // "导出到剪贴板失败：{error}"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // 一键导入配置项从剪贴板
  const handleImportFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        throw new Error(t('clipboardEmpty')); // "剪贴板为空！"
      }
      const importedSettings = JSON.parse(text);
      if (typeof importedSettings !== 'object' || importedSettings === null) {
        throw new Error(t('invalidFormat')); // "文件内容格式无效！"
      }
      const validSettings = { ...defaultSettings, ...importedSettings };
      setSettings(validSettings);
      setSnackbarMessage(t('importClipboardSuccess')); // "配置已成功从剪贴板导入！"
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('从剪贴板导入失败：', error);
      setSnackbarMessage(t('importClipboardFailed', { error: error.message })); // "从剪贴板导入失败：{error}"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // 导出到文件
  const handleExportToFile = () => {
    try {
      const settingsJson = JSON.stringify(settings, null, 2);
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'settings.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSnackbarMessage(t('exportFileSuccess')); // "配置已成功导出到文件！"
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('导出到文件失败：', error);
      setSnackbarMessage(t('exportFileFailed', { error: error.message })); // "导出到文件失败：{error}"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // 从文件导入
  const handleImportFromFile = () => {
    fileInputRef.current.click(); // 触发文件选择
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        if (!text.trim()) {
          throw new Error(t('fileEmpty')); // "文件为空！"
        }
        const importedSettings = JSON.parse(text);
        if (typeof importedSettings !== 'object' || importedSettings === null) {
          throw new Error(t('invalidFormat')); // "文件内容格式无效！"
        }
        const validSettings = { ...defaultSettings, ...importedSettings };
        setSettings(validSettings);
        setSnackbarMessage(t('importFileSuccess')); // "配置已成功从文件导入！"
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('从文件导入失败：', error);
        setSnackbarMessage(t('importFileFailed', { error: error.message })); // "从文件导入失败：{error}"
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };
    reader.onerror = () => {
      setSnackbarMessage(t('importFileFailed', { error: '读取文件时出错' })); // "从文件导入失败：读取文件时出错"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    };
    reader.readAsText(file);
    event.target.value = null; // 重置 input，避免重复选择同一文件不触发
  };

  // 保存设置
  const handleSave = async () => {
    if (!settings.backendUrl.trim()) {
      setSnackbarMessage(t('backendUrlRequired')); // "后端地址是必填项！"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      onClose();
      setSnackbarMessage(t('saveSuccess')); // "配置已成功应用到本地和服务器！"
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('保存配置失败：', error);
      setSnackbarMessage(t('saveFailed', { error: error.message })); // "保存配置失败：{error}"
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {t('settings')} {/* "设置" */}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label={t('backendUrl')} // "后端地址"
                name="backendUrl"
                value={settings.backendUrl}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('aiServerUrl')} // "AI服务器地址"
                name="aiServerUrl"
                value={settings.aiServerUrl}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('cookie')} // "Cookie"
                name="cookie"
                value={settings.cookie}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('textUrl')} // "文本处理 URL（选填）"
                name="textUrl"
                value={settings.textUrl}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('textToken')} // "文本处理 Token（选填）"
                name="textToken"
                value={settings.textToken}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('textModel')} // "文本处理模型（选填）"
                name="textModel"
                value={settings.textModel}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('videoUrl')} // "视频处理 URL（选填）"
                name="videoUrl"
                value={settings.videoUrl}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('videoToken')} // "视频处理 Token（选填）"
                name="videoToken"
                value={settings.videoToken}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('videoModel')} // "视频处理模型（选填）"
                name="videoModel"
                value={settings.videoModel}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('imageUrl')} // "图片处理 URL（选填）"
                name="imageUrl"
                value={settings.imageUrl}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('imageToken')} // "图片处理 Token（选填）"
                name="imageToken"
                value={settings.imageToken}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('imageModel')} // "图片处理模型（选填）"
                name="imageModel"
                value={settings.imageModel}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
  display: 'flex',
  flexWrap: 'wrap', // 禁止换行
}}>
          <Button onClick={handleExportToClipboard} color="secondary">
            {t('exportClipboard')} {/* "导出到剪贴板" */}
          </Button>
          <Button onClick={handleImportFromClipboard} color="secondary">
            {t('importClipboard')} {/* "从剪贴板导入" */}
          </Button>
          <br />
          <Button onClick={handleExportToFile} color="secondary">
            {t('exportFile')} {/* "导出到文件" */}
          </Button>
          <Button onClick={handleImportFromFile} color="secondary">
            {t('importFile')} {/* "从文件导入" */}
          </Button>
          <Button onClick={handleSave} color="primary">
            {t('save')} {/* "确定应用" */}
          </Button>
        </DialogActions>
      </Dialog>
      {/* 隐藏的文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json"
        onChange={handleFileChange}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SettingsDialog;