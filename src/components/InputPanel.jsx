import React, { useState, useEffect } from 'react';
import { Paper, Button, Snackbar, Tabs, Tab, Box, TextField, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TitleInput from './TitleInput';
import CoverInput from './CoverInput';
import VideoDropzone from './VideoDropzone';
import { handleAnalyzeProfessional } from '../utils/analyzeProfessional';
import { all_partitions } from '../utils/partitions';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        style={{ height: '100%' }}
        {...other}
    >
        {value === index && (
            <Box sx={{ p: 3, height: '100%' }}>{children}</Box>
        )}
    </div>
);

const a11yProps = (index) => ({
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
});

const InputPanel = ({ setLogs, onAnalysisComplete, onLoadingChange, clearOutputs, setTabIndex }) => {
    const { t } = useTranslation();

    const getInitialState = (key, defaultValue) => {
        try {
            const stored = sessionStorage.getItem(key);
            if (stored === null) return defaultValue;
            const parsed = JSON.parse(stored);
            // Ensure parsed value is valid for the specific key
            if (key === 'partition' && parsed && typeof parsed === 'string') {
                // Verify partition exists in all_partitions
                const isValid = all_partitions.some(main => 
                    main.name === parsed || 
                    main.subcategories.some(sub => sub.tid.toString() === parsed)
                );
                return isValid ? parsed : defaultValue;
            }
            if ((key === 'coverFile' || key === 'videoFile') && stored === 'null') return null;
            if (typeof parsed === typeof defaultValue) return parsed;
            return defaultValue;
        } catch (error) {
            console.error(`Error parsing sessionStorage item ${key}:`, error);
            sessionStorage.removeItem(key);
            return defaultValue;
        }
    };

    const [tabIndex, setLocalTabIndex] = useState(() => getInitialState('tabIndex', 0));
    const [title, setTitle] = useState(() => getInitialState('title', ''));
    const [coverFile, setCoverFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoLink, setVideoLink] = useState(() => getInitialState('videoLink', ''));
    const [historicalPlayCount, setHistoricalPlayCount] = useState(() => getInitialState('historicalPlayCount', ''));
    const [historicalLikeCount, setHistoricalLikeCount] = useState(() => getInitialState('historicalLikeCount', ''));
    const [fanCount, setFanCount] = useState(() => getInitialState('fanCount', ''));
    const [partition, setPartition] = useState(() => getInitialState('partition', ''));
    const [videoDuration, setVideoDuration] = useState(() => getInitialState('videoDuration', ''));
    const [scriptContent, setScriptContent] = useState(() => getInitialState('scriptContent', ''));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [introContent, setIntroContent] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState(() => {
        const storedPartition = getInitialState('partition', '');
        if (storedPartition) {
            const mainCat = all_partitions.find(cat => 
                cat.name === storedPartition || 
                cat.subcategories.some(sub => sub.tid.toString() === storedPartition)
            );
            return mainCat ? mainCat.name : '';
        }
        return '';
    });

    const saveToSessionStorage = (key, value) => {
        if (key === 'coverFile' || key === 'videoFile') return;
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting sessionStorage item ${key}:`, error);
        }
    };

    useEffect(() => {
        fetch('/me.md')
            .then(response => response.ok ? response.text() : Promise.reject(t('failedToLoadMarkdown') || '加载介绍内容失败'))
            .then(text => setIntroContent(text))
            .catch(err => { console.error(err); setIntroContent(t('failedToLoadContent') || '无法加载内容'); });
    }, [t]);

    useEffect(() => { saveToSessionStorage('tabIndex', tabIndex); }, [tabIndex]);
    useEffect(() => { saveToSessionStorage('title', title); }, [title]);
    useEffect(() => { saveToSessionStorage('videoLink', videoLink); }, [videoLink]);
    useEffect(() => { saveToSessionStorage('historicalPlayCount', historicalPlayCount); }, [historicalPlayCount]);
    useEffect(() => { saveToSessionStorage('historicalLikeCount', historicalLikeCount); }, [historicalLikeCount]);
    useEffect(() => { saveToSessionStorage('fanCount', fanCount); }, [fanCount]);
    useEffect(() => { saveToSessionStorage('partition', partition); }, [partition]);
    useEffect(() => { saveToSessionStorage('videoDuration', videoDuration); }, [videoDuration]);
    useEffect(() => { saveToSessionStorage('scriptContent', scriptContent); }, [scriptContent]);

    const handleTabChange = (event, newValue) => {
        setLocalTabIndex(newValue);
        setTabIndex(newValue);
    };

    const handleMainCategoryChange = (event) => {
        setSelectedMainCategory(event.target.value);
        setPartition(''); // Clear subcategory when main category changes
    };

    const getAppSettings = () => {
        let appSettings = { backendUrl: "http://localhost:4432" };
        try {
            const settingsStr = localStorage.getItem('appSettings');
            if (settingsStr) {
                const parsedSettings = JSON.parse(settingsStr);
                if (parsedSettings && parsedSettings.backendUrl && typeof parsedSettings.backendUrl === 'string' && parsedSettings.backendUrl.trim() !== '') {
                    appSettings = parsedSettings;
                    appSettings.backendUrl = appSettings.backendUrl.trim();
                } else {
                    console.warn("Stored appSettings invalid or missing backendUrl, using default.");
                    localStorage.setItem('appSettings', JSON.stringify(appSettings));
                    return appSettings;
                }
            } else {
                localStorage.setItem('appSettings', JSON.stringify(appSettings));
            }
        } catch (error) {
            console.error("Error reading or parsing appSettings from localStorage:", error);
            localStorage.setItem('appSettings', JSON.stringify(appSettings));
            return appSettings;
        }
        if (appSettings.backendUrl && !appSettings.backendUrl.startsWith('http://') && !appSettings.backendUrl.startsWith('https://')) {
            appSettings.backendUrl = `http://${appSettings.backendUrl}`;
            console.warn(`Backend URL was missing protocol, prepended http://. Current URL: ${appSettings.backendUrl}`);
            localStorage.setItem('appSettings', JSON.stringify(appSettings));
        }
        return appSettings;
    };

    const safeFetch = async (url, options) => {
        if (!url || typeof url !== 'string' || !url.startsWith('http')) throw new Error(`Invalid URL for fetch: ${url}`);
        if (options.method === 'POST' && !options.body) {
            console.warn(`POST request to ${url} had no body. Sending empty body.`);
            if (options.headers && options.headers['Content-Type'] === 'application/json') options.body = JSON.stringify({});
            else options.body = new FormData();
        }
        console.log(`Fetching: ${options.method || 'GET'} ${url}`);
        return fetch(url, options);
    };

    const handleAnalyzeSimple = async () => {
        if (!videoLink) { setSnackbarMessage(t('fillVideoLink') || '请填写视频链接'); setSnackbarOpen(true); return; }
        if (clearOutputs) clearOutputs(); else console.error("clearOutputs function not passed!");
        if (onLoadingChange) onLoadingChange(true);
        let appSettings, backendUrl;

        try {
            appSettings = getAppSettings();
            backendUrl = appSettings.backendUrl;
            console.log('Using Backend URL for Simple Analysis:', backendUrl);
            if (!backendUrl || !backendUrl.startsWith('http')) throw new Error('Invalid backend URL configured.');

            const response = await safeFetch(`${backendUrl}/analyze_video_link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoLink: videoLink, config: appSettings })
            });

            if (!response.ok) {
                let errorMsg = t('linkAnalysisFailed') || '视频链接分析失败';
                try { const errorData = await response.json(); errorMsg = `${errorMsg} (${response.status}): ${errorData.message || ''}`; } catch (e) { errorMsg = `${errorMsg} (${response.status})`; }
                throw new Error(errorMsg.trim());
            }
            const data = await response.json();
            if (data.step && data.message) setLogs(prev => [...prev, `${data.step}: ${data.message}`]);
            else if (data.message) setLogs(prev => [...prev, data.message]);
            if (onAnalysisComplete) {
                onAnalysisComplete({
                    predicted: data.predicted_play_count,
                    range: data.range_score,
                    title: data.title,
                    link: videoLink,
                    estimated7DayViews: data.estimated7DayViews,
                    trending_analysis: data.trending_analysis
                });
            }
        } catch (err) {
            console.error("Simple Analysis Error:", err);
            setSnackbarMessage(`${t('error')}: ${err.message || 'Unknown error during simple analysis'}`);
            setSnackbarOpen(true);
            setLogs(prev => [...prev, `${t('error')}: ${err.message}`]);
            if (onAnalysisComplete) { onAnalysisComplete({ error: err.message }); }
        } finally {
            if (onLoadingChange) onLoadingChange(false);
        }
    };

    const handleCoverFileChange = (file) => setCoverFile(file);
    const handleVideoFileChange = (file) => setVideoFile(file);

    const getPartitionName = () => {
        if (!selectedMainCategory) return '';
        const mainCat = all_partitions.find(cat => cat.name === selectedMainCategory);
        if (!partition) return mainCat.name;
        const subCat = mainCat.subcategories.find(sub => sub.tid.toString() === partition);
        return subCat ? subCat.name : mainCat.name;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Tabs 
                value={tabIndex} 
                onChange={handleTabChange} 
                indicatorColor="primary" 
                textColor="primary" 
                variant="fullWidth" 
                sx={{ flexShrink: 0, '& .MuiTab-root:focus': { outline: 'none' } }}
            >
                <Tab label={t('介绍')} {...a11yProps(0)} />
                <Tab label={t('简单')} {...a11yProps(1)} />
                <Tab label={t('专业')} {...a11yProps(2)} />
            </Tabs>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', height: 'calc(100% - 48px)' }}>
                <TabPanel value={tabIndex} index={0}>
                    <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 2 }}>
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                a: ({node, ...props}) => (
                                    <a target="_blank" rel="noopener noreferrer" {...props} />
                                )
                            }}
                        >
                            {introContent}
                        </ReactMarkdown>
                    </Paper>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 2 }}>
                        <TextField label={t("哔哩哔哩视频链接")} value={videoLink} onChange={(e) => setVideoLink(e.target.value)} fullWidth variant="outlined" />
                        <Button variant="contained" size="large" fullWidth onClick={handleAnalyzeSimple}>{t('analyze')}</Button>
                    </Paper>
                </TabPanel>
                <TabPanel value={tabIndex} index={2}>
                    <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', gap: 3, borderRadius: 2, maxHeight: '100%', overflowY: 'auto' }}>
                        <TitleInput value={title} onChange={(e) => setTitle(e.target.value)} />
                        <Box sx={{ display: 'flex', gap: 2, height: '160px', '& > *': { flex: 1 } }}>
                            <Box sx={{
                                height: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: '0 0 40%'
                            }}>
                                <CoverInput onFileChange={handleCoverFileChange} initialFile={coverFile} />
                            </Box>
                            <TextField
                                label={t('视频字幕/文案')}
                                value={scriptContent}
                                onChange={(e) => setScriptContent(e.target.value)}
                                variant="outlined"
                                multiline
                                sx={{
                                    height: '100%',
                                    '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start', paddingTop: '10px' },
                                    '& .MuiInputBase-inputMultiline': { height: 'calc(100% - 20px) !important', overflow: 'auto !important' },
                                }}
                            />
                        </Box>
                        <VideoDropzone onFileChange={handleVideoFileChange} initialFile={videoFile} />
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                            <TextField label={t('历史稿件播放数')} value={historicalPlayCount} onChange={(e) => setHistoricalPlayCount(e.target.value)} fullWidth variant="outlined" type="number" InputProps={{ inputProps: { min: 0 } }} />
                            <TextField label={t('历史点赞数')} value={historicalLikeCount} onChange={(e) => setHistoricalLikeCount(e.target.value)} fullWidth variant="outlined" type="number" InputProps={{ inputProps: { min: 0 } }} />
                            <TextField label={t('现有粉丝数')} value={fanCount} onChange={(e) => setFanCount(e.target.value)} fullWidth variant="outlined" type="number" InputProps={{ inputProps: { min: 0 } }} />
                            <TextField label={t('视频时长（秒）')} value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} fullWidth variant="outlined" type="number" InputProps={{ inputProps: { min: 0 } }} />
                        </Box>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <Select
                                    value={selectedMainCategory}
                                    onChange={handleMainCategoryChange}
                                    displayEmpty
                                    variant="outlined"
                                    sx={{ width: '30%' }}
                                    renderValue={(selected) => selected || t('选择主分区')}
                                >
                                    {all_partitions.map((mainCategory) => (
                                        <MenuItem key={mainCategory.tid} value={mainCategory.name}>
                                            {mainCategory.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={partition}
                                    onChange={(e) => setPartition(e.target.value)}
                                    displayEmpty
                                    variant="outlined"
                                    sx={{ width: '70%' }}
                                    renderValue={(selected) => {
                                        if (!selectedMainCategory) return t('选择子分区');
                                        if (!selected) return t('选择子分区');
                                        const mainCat = all_partitions.find(cat => cat.name === selectedMainCategory);
                                        const subCat = mainCat?.subcategories.find(sub => sub.tid.toString() === selected);
                                        return subCat ? subCat.name : t('选择子分区');
                                    }}
                                    disabled={!selectedMainCategory}
                                >
                                    {selectedMainCategory && all_partitions
                                        .find(cat => cat.name === selectedMainCategory)
                                        ?.subcategories.map((subcategory) => (
                                            <MenuItem key={subcategory.tid} value={subcategory.tid.toString()}>
                                                {subcategory.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={() => {
                                if (!selectedMainCategory) {
                                    setSnackbarMessage(t('pleaseSelectMainCategory') || '请选择主分区');
                                    setSnackbarOpen(true);
                                    return;
                                }
                                handleAnalyzeProfessional({
                                    title,
                                    coverFile,
                                    videoFile,
                                    historicalPlayCount,
                                    historicalLikeCount,
                                    fanCount,
                                    partition: getPartitionName(),
                                    scriptContent,
                                    setLogs,
                                    videoDuration,
                                    onAnalysisComplete,
                                    onLoadingChange,
                                    clearOutputs,
                                    setSnackbarMessage,
                                    setSnackbarOpen,
                                    t,
                                    getAppSettings,
                                    safeFetch,
                                });
                            }}
                        >
                            {t('analyze')}
                        </Button>
                    </Paper>
                </TabPanel>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default InputPanel;