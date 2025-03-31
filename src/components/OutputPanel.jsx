import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';

function OutputPanel({ logs, analysisInfo, loading }) {
    const { t } = useTranslation();
    const [displayedInfo, setDisplayedInfo] = useState("");
    const [finalInfoText, setFinalInfoText] = useState("");
    const [hasAnimated, setHasAnimated] = useState(false);  // 添加新状态
    const isMobile = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        if (!loading && analysisInfo) {
            let text = "";
            if (analysisInfo.error) {
                text = `${t('error')}: ${analysisInfo.error}`;
            } else {
                if (analysisInfo.coverInfo) text += `${t('coverAnalysisResult')}: ${analysisInfo.coverInfo}\n\n`;
                if (analysisInfo.videoSummary) text += `${analysisInfo.videoSummary}\n`;
                if (analysisInfo.trending_analysis) {
                    text += `\n${t('trendingAnalysis')}:\n`;
                    text += `${t('creativity')}: ${analysisInfo.trending_analysis.creativity}\n`;
                    text += `${t('emotion')}: ${analysisInfo.trending_analysis.emotion}\n`;
                    text += `${t('trending')}: ${analysisInfo.trending_analysis.trending}\n`;
                    text += `${t('visual')}: ${analysisInfo.trending_analysis.visual}\n`;
                }
                if (analysisInfo.predicted) {
                    text += `\n${t('predictedPlayCountScore')}: ${Math.floor(analysisInfo.predicted)}`;
                    text += `\n${t('estimated7DayViews_1x')}: ${Math.floor(Number(analysisInfo.predicted) * 10)}-${Math.floor(Number(analysisInfo.predicted) * 0.1)} ${t('88%Accuracy')}`;
                    text += `\n${t('estimated7DayViews_0.5x')}: ${Math.floor(Number(analysisInfo.predicted) * 5)}-${Math.floor(Number(analysisInfo.predicted) * 0.05)} ${t('58%Accuracy')}`;
                }
            }
            setFinalInfoText(text.trim() || t('no_analysis_data'));
        } else if (!loading && !analysisInfo) {
            setFinalInfoText(t('no_analysis_data'));
        } else {
            setFinalInfoText("");
        }
    }, [loading, analysisInfo, t]);

    useEffect(() => {
        let interval;
        // 添加 !hasAnimated 条件
        if (!loading && finalInfoText && finalInfoText !== t('no_analysis_data') && !hasAnimated) {
            setDisplayedInfo("");
            let currentLength = 0;
            interval = setInterval(() => {
                currentLength += 3;
                if (currentLength >= finalInfoText.length) {
                    currentLength = finalInfoText.length;
                    clearInterval(interval);
                    setHasAnimated(true);  // 标记动画已完成
                }
                setDisplayedInfo(finalInfoText.substring(0, currentLength));
            }, 50);
        } else {
            setDisplayedInfo(finalInfoText);
            if (interval) clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [loading, finalInfoText, t, hasAnimated]);  // 添加 hasAnimated 依赖

    const commonTextStyle = {
        fontSize: '1.6rem',
        lineHeight: 1.7,
        fontWeight: 400,
        color: 'text.primary',
        textAlign: 'left',
        fontFamily: 'Roboto, sans-serif',
        mb: 0.5,
    };

    const secondaryTextStyle = {
        ...commonTextStyle,
        color: 'text.secondary',
        fontStyle: 'italic',
    };

    return (
        <Paper
            elevation={3}
            sx={(theme) => ({
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                borderRadius: 2,
                width: 'calc(50vw - 80px)',
                minHeight: 'calc(100vh - 100px)',
                margin: '0 auto',
                backgroundColor: 'background.paper',
                [theme.breakpoints.down('sm')]: {
                    width: '88%',
                    margin: '0 auto',
                    minHeight: isMobile ? 'auto' : 'calc(100vh - 100px)', // 手机端动态调整
                },
            })}
        >
            {/* Workflow 区域 */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'left', flexShrink: 0 }}>
                {t('workflow')}
            </Typography>
            <Box
                sx={{
                    overflowY: isMobile && logs && logs.length > 0 ? 'auto' : 'hidden', // 手机端动态滚动
                    backgroundColor: 'background.paper',
                    padding: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'pre-line',
                    minHeight: isMobile ? '100px' : 'auto',
                    maxHeight: isMobile ? '500px' : 'auto', // 手机端固定最大高度为 200px
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#aaa' },
                }}
            >
                {logs && logs.length > 0 ? (
                    logs.map((line, index) => (
                        <Typography key={index} variant="body1" sx={commonTextStyle}>
                            {line}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body1" sx={secondaryTextStyle}>
                        {t('no_data')}
                    </Typography>
                )}
            </Box>

            {/* Info 区域 */}
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'left', flexShrink: 0 }}>
                {t('Info')}
            </Typography>
            <Box
                sx={{
                    overflowY: isMobile && finalInfoText && finalInfoText !== t('no_analysis_data') ? 'auto' : 'auto', // 手机端动态滚动
                    backgroundColor: 'background.paper',
                    padding: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    whiteSpace: 'pre-line',
                    minHeight: isMobile ? '100px' : '200px',
                    maxHeight: isMobile ? 'calc(60vh - 50px)' : 'calc(100vh - 600px)', // 保持原有最大高度
                    display: 'flex',
                    flexDirection: 'column',
                    '&::-webkit-scrollbar': { width: '8px' },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#aaa' },
                }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <CircularProgress color="primary" />
                        <Typography variant="body1" sx={{ mt: 2, ...secondaryTextStyle }}>
                            {t('loading')}...
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="body1" sx={finalInfoText === t('no_analysis_data') ? secondaryTextStyle : commonTextStyle}>
                        {displayedInfo}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}

export default OutputPanel;