// src/components/CoverInput.jsx
import React, { useCallback, useState } from 'react';
import { Box, Typography, Dialog, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';

function CoverInput({ onFileChange }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);

  const compressImage = (file, maxSizeMB, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let width = img.width;
        let height = img.height;
        const scaleFactor = Math.sqrt(file.size / (maxSizeMB * 1024 * 1024));
        if (scaleFactor > 1) {
          width /= scaleFactor;
          height /= scaleFactor;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob.size > maxSizeMB * 1024 * 1024) {
            alert(t('compressError'));
          } else {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
            setPreview(URL.createObjectURL(compressedFile));
            if (onFileChange) {
              onFileChange(compressedFile);
            }
            callback(compressedFile);
          }
        }, 'image/jpeg', 0.8);
      };
    };
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      compressImage(acceptedFiles[0], 2, (compressedFile) => {
        console.log('上传封面：', compressedFile);
      });
    }
  }, [onFileChange, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <Box textAlign="center" sx={{ width: '100%', position: 'relative' }}>
      <Box
        {...getRootProps()}
        sx={{
          padding: 2, // 减少内边距，留出更多空间给图片
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          minHeight: '160px', // 设置最小高度，确保有足够空间
          display: 'flex', // 使内容居中
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDragActive ? 'action.focus' : 'action.hover', // 拖动时改变背景
          border: '2px dashed',
          borderColor: isDragActive ? 'secondary.main' : 'primary.main',
          borderRadius: 2,
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ pointerEvents: 'none', zIndex: 1 }}>
          {!preview ? (
            <Box sx={{ pointerEvents: 'none' }}>
              <Typography variant="subtitle1">{t('uploadCover')}</Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                {t('coverDropHint')}
              </Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1" sx={{ opacity: 0.7 }}>
              {t(' ')}
            </Typography>
          )}
        </Box>
        {preview && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
              }}
            >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  if (onFileChange) {
                    onFileChange(null);
                  }
                }}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  color: 'white',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'zoom-in',
                padding: 1, // 减少内边距，增加图片显示空间
                '& img': {
                  width: '100%', // 确保图片宽度占满容器
                  height: '100%', // 确保图片高度占满容器
                  objectFit: 'contain', // 保持比例
                  borderRadius: 2,
                },
              }}
            >
              <img src={preview} alt="Uploaded Cover" />
            </Box>
          </>
        )}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        {preview && <img src={preview} alt="Fullscreen Cover" style={{ maxWidth: '100%', height: 'auto' }} />}
      </Dialog>
    </Box>
  );
}

export default CoverInput;