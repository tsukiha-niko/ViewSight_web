import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Dialog, 
  IconButton, 
  CircularProgress, 
  Button, 
  Snackbar 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { fetchFile } from '@ffmpeg/ffmpeg';

// FFmpeg 配置
const COMPRESS_CONFIG = {
  targetFPS: 10,
  targetBitrate: '80k'
};

function VideoDropzone({ onFileChange }) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null); // 新增状态记录预览类型
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const cancelRef = useRef(false);

  React.useEffect(() => {
    const loadFFmpeg = async () => {
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }
    };
    loadFFmpeg();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const compressVideo = async (file) => {
    cancelRef.current = false;
    setCompressing(true);
    setCompressionProgress(0);

    try {
      if (!ffmpeg.isLoaded()) {
        console.log('加载 FFmpeg...');
        await ffmpeg.load();
      }

      const inputFileName = 'input.mp4';
      const outputFileName = 'output.webm';

      console.log('写入输入文件:', inputFileName);
      ffmpeg.FS('writeFile', inputFileName, await fetchFile(file));

      ffmpeg.setLogging(true);
      ffmpeg.setLogger(({ type, message }) => {
        console.log(`FFmpeg [${type}]: ${message}`);
      });

      ffmpeg.setProgress(({ ratio }) => {
        if (cancelRef.current) return;
        const progress = Math.max(0, Math.min(95, ratio * 100));
        setCompressionProgress(progress);
      });

      const ffmpegPromise = ffmpeg.run(
        '-i', inputFileName,
        '-r', `${COMPRESS_CONFIG.targetFPS}`,
        '-c:v', 'libvpx',
        '-b:v', COMPRESS_CONFIG.targetBitrate,
        '-speed', '8',
        '-c:a', 'libvorbis',
        '-b:a', '64k',
        outputFileName
      );

      await Promise.race([
        ffmpegPromise,
        new Promise((_, reject) => {
          const checkCancel = () => {
            if (cancelRef.current) {
              reject(new Error('压缩已取消'));
            } else {
              setTimeout(checkCancel, 100);
            }
          };
          checkCancel();
        })
      ]);

      if (cancelRef.current) {
        throw new Error('压缩已取消');
      }

      const files = ffmpeg.FS('readdir', '/');
      console.log('文件系统内容:', files);
      if (!files.includes(outputFileName)) {
        throw new Error(`输出文件 "${outputFileName}" 未在 FFmpeg 文件系统中找到`);
      }

      const data = ffmpeg.FS('readFile', outputFileName);
      const compressedBlob = new Blob([data.buffer], { type: 'video/webm' });

      ffmpeg.FS('unlink', inputFileName);
      ffmpeg.FS('unlink', outputFileName);

      setCompressionProgress(100);

      return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '.webm'), {
        type: 'video/webm',
        lastModified: Date.now()
      });
    } catch (error) {
      if (!cancelRef.current) {
        console.error('视频压缩错误:', error);
        throw error;
      }
      return null;
    } finally {
      setCompressing(false);
    }
  };

  const cancelCompression = () => {
    // 直接刷新页面
    window.location.reload();
  };

  const processVideo = async (file, maxSizeMB = 800) => { // 修改最大支持大小为 800MB
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert(t('invalidVideoType'));
      throw new Error('Invalid video type');
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(t('videoSizeExceeded', { size: '800MB' })); // 更新提示信息
      throw new Error('Video size exceeded');
    }

    let processedFile;
    const sizeLimit = 5000 * 1024 * 1024; // 50MB 作为压缩阈值 --- 目前先扩到5000M

    if (file.size > sizeLimit) {
      setSnackbarOpen(true);
      processedFile = await compressVideo(file);
      if (!processedFile) throw new Error('Compression canceled');
      if (!cancelRef.current) {
        const previewUrl = URL.createObjectURL(processedFile);
        setPreview(previewUrl);
        setPreviewType('video/webm'); // 压缩后类型为 webm
      }
    } else {
      processedFile = file;
      if (!cancelRef.current) {
        const previewUrl = URL.createObjectURL(processedFile);
        setPreview(previewUrl);
        setPreviewType(file.type); // 未压缩时保留原始类型
      }
    }

    return processedFile;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setUploading(true);
      try {
        const processedFile = await processVideo(acceptedFiles[0]);
        if (!cancelRef.current && onFileChange) {
          onFileChange(processedFile);
        }
      } catch (error) {
        console.error('Video processing failed:', error);
      } finally {
        setUploading(false);
      }
    }
  }, [onFileChange, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'video/mp4, video/webm, video/quicktime',
    multiple: false,
  });

  return (
    <Box
      textAlign="center"
      sx={{
        width: '100%',
        position: 'relative',
        '&:hover .video-overlay': {
          opacity: 1,
        },
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '1px dashed',
          borderColor: isDragActive ? 'secondary.main' : 'primary.main',
          borderRadius: 2,
          padding: 4,
          backgroundColor: isDragActive ? 'action.focus' : 'action.hover', // 拖动时改变背景
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minHeight: 400,
          maxHeight: 600,
          position: 'relative',
          overflow: 'hidden',
          opacity: compressing || uploading ? 0.7 : 1,
        }}
      >
        <input {...getInputProps()} />
        
        {compressing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0,0,0,0.8)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress 
              variant="determinate" 
              value={compressionProgress} 
              size={60}
              sx={{ color: 'white', mb: 2 }}
            />
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              {t('compressing')} {Math.round(compressionProgress)}%
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                cancelCompression();
              }}
            >
              {t('cancel')}
            </Button>
          </Box>
        )}

        {uploading && !compressing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
              {t('uploading')}
            </Typography>
          </Box>
        )}

        {!preview && !uploading && !compressing && (
          <Box sx={{ pointerEvents: 'none' }}>
            <Typography variant="subtitle1">{t('uploadVideo')}</Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              {t('videoDropHint')}
            </Typography>
          </Box>
        )}

        {preview && !compressing && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                setPreviewType(null); // 重置类型
                URL.revokeObjectURL(preview);
                if (onFileChange) {
                  onFileChange(null);
                }
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                color: 'white',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <video
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              >
                <source src={preview} type={previewType || 'video/mp4'} />
                {t('videoNotSupported')}
              </video>
              <Box
                className="video-overlay"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  cursor: 'pointer',
                }}
              >
                <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={t('videoSizeExceeds50MB', { size: '50MB' })} // 更新为动态提示
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <video
            controls
            autoPlay
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <source src={preview} type={previewType || 'video/mp4'} />
            {t('videoNotSupported')}
          </video>
        </Box>
      </Dialog>
    </Box>
  );
}

export default VideoDropzone;