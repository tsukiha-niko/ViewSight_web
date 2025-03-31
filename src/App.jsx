import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container, IconButton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import SettingsDialog from './components/SettingsDialog';
import { useTranslation } from 'react-i18next';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { createTheme } from '@mui/material/styles';

// 阴影管理工具函数
const elevation = (level, mode) => {
  const darkShadows = [
    'none',
    '0 1px 3px rgba(255,255,255,0.12)',
    '0 4px 6px rgba(255,255,255,0.15)',
    '0 8px 12px rgba(255,255,255,0.2)',
    '0 12px 24px rgba(255,255,255,0.25)'
  ];
  
  const lightShadows = [
    'none',
    '0 1px 2px rgba(0,0,0,0.08)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.12)',
    '0 8px 16px rgba(0,0,0,0.14)'
  ];
  
  return mode === 'dark' ? darkShadows[level] : lightShadows[level];
};

// 创建主题
export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'dark' ? '#3d9eff' : '#1a73e8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'dark' ? '#a5d6ff' : '#4285f4',
        contrastText: mode === 'dark' ? '#121212' : '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f8f9fa',
        paper: mode === 'dark' ? '#121212' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(0, 0, 0, 0.87)',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.85)',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    shape: {
      borderRadius: 12,
    },
    transitions: {
      create: (props = ['all'], options = {}) => {
        // 确保 props 是数组
        const properties = Array.isArray(props) ? props : [props];
        return properties
          .map((p) => `${p} 300ms cubic-bezier(0.4, 0, 0.2, 1)`)
          .join(', ');
      },
    },
  });
};

function App() {
    const { t } = useTranslation();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const isMobile = useMediaQuery('(max-width: 600px)');

    // --- 主题状态管理 ---
    const getInitialMode = () => {
        const storedMode = localStorage.getItem('themeMode');
        return storedMode || (prefersDarkMode ? 'dark' : 'light');
    };
    const [mode, setMode] = useState(getInitialMode);

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleMode = () => {
        setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    // --- 设置对话框状态 ---
    const [settingsOpen, setSettingsOpen] = useState(false);
    const handleSettingsOpen = () => setSettingsOpen(true);
    const handleSettingsClose = () => setSettingsOpen(false);

    // --- 样式主题创建 ---
    const theme = useMemo(() => createAppTheme(mode), [mode]); // 使用自定义主题函数

    // --- 状态管理: 日志, 分析信息, 加载状态, 当前 Tab ---
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const getSessionData = (modeKey, defaultValue) => {
        const data = sessionStorage.getItem(modeKey);
        return data ? JSON.parse(data) : defaultValue;
    };

    const [simpleLogs, setSimpleLogs] = useState(() => getSessionData('simpleLogs', []));
    const [simpleAnalysisInfo, setSimpleAnalysisInfo] = useState(() => getSessionData('simpleAnalysisInfo', null));
    const [professionalLogs, setProfessionalLogs] = useState(() => getSessionData('professionalLogs', []));
    const [professionalAnalysisInfo, setProfessionalAnalysisInfo] = useState(() => getSessionData('professionalAnalysisInfo', null));

    const currentLogs = tabIndex === 1 ? simpleLogs : tabIndex === 2 ? professionalLogs : [];
    const currentAnalysisInfo = tabIndex === 1 ? simpleAnalysisInfo : tabIndex === 2 ? professionalAnalysisInfo : null;

    useEffect(() => {
        sessionStorage.setItem('simpleLogs', JSON.stringify(simpleLogs));
    }, [simpleLogs]);
    useEffect(() => {
        sessionStorage.setItem('simpleAnalysisInfo', JSON.stringify(simpleAnalysisInfo));
    }, [simpleAnalysisInfo]);
    useEffect(() => {
        sessionStorage.setItem('professionalLogs', JSON.stringify(professionalLogs));
    }, [professionalLogs]);
    useEffect(() => {
        sessionStorage.setItem('professionalAnalysisInfo', JSON.stringify(professionalAnalysisInfo));
    }, [professionalAnalysisInfo]);

    const handleSetLogs = (newLogs) => {
        if (tabIndex === 1) setSimpleLogs(newLogs);
        else if (tabIndex === 2) setProfessionalLogs(newLogs);
    };
    const handleAnalysisComplete = (info) => {
        if (tabIndex === 1) setSimpleAnalysisInfo(info);
        else if (tabIndex === 2) setProfessionalAnalysisInfo(info);
    };
    const handleLoadingChange = (isLoading) => setLoading(isLoading);
    const clearOutputs = () => {
        if (tabIndex === 1) {
            setSimpleLogs([]);
            setSimpleAnalysisInfo(null);
        } else if (tabIndex === 2) {
            setProfessionalLogs([]);
            setProfessionalAnalysisInfo(null);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default, display: 'flex', flexDirection: 'column', maxWidth: '100vw' }}>
                <AppBar position="static" color="primary" elevation={2} sx={{ borderRadius: 1, paddingX: 2, flexShrink: 0 , minWidth: '100vw'}}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant={isMobile ? 'h4' : 'h3'} sx={{ fontSize: isMobile ? '1.25rem' : '2rem', fontWeight: 'bold' }}>
                            {t('TsukihaNiko-Proposer')}
                        </Typography>
                        {!isMobile && (
                            <>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'right' }}>
                                    项目内测中 | QQ群号：584971665
                                </Typography>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'right' }}>
                                    版本：DEMO v0.2 | 模型版本：v21
                                </Typography>
                            </>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton onClick={toggleMode} color="inherit">
                                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                            <IconButton onClick={handleSettingsOpen} color="inherit">
                                <SettingsIcon />
                            </IconButton>
                            <LanguageSwitcher />
                        </Box>
                    </Toolbar>
                </AppBar>

                <Container maxWidth={false} sx={{
                    paddingY: 2,
                    paddingX: 0,
                    width: '100%',
                    margin: 0,
                    display: 'grid',
                    placeItems: 'top center',
                    flexGrow: 1,
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        width: { xs: '100%', sm: 'calc(100vw - 48px - 18px)' },
                    }}>
                        <Box sx={{
                            flex: { xs: 'none', sm: 1 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            minWidth: { xs: '100vw', sm: '50vw' },
                            width: { xs: '100%', sm: 'auto' },
                        }}>
                            <InputPanel
                                setLogs={handleSetLogs}
                                onAnalysisComplete={handleAnalysisComplete}
                                onLoadingChange={handleLoadingChange}
                                clearOutputs={clearOutputs}
                                setTabIndex={setTabIndex}
                            />
                        </Box>
                        <Box sx={{
                            flex: { xs: 'none', sm: 1 },
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}>
                            <OutputPanel
                                logs={currentLogs}
                                analysisInfo={currentAnalysisInfo}
                                loading={loading}
                            />
                        </Box>
                    </Box>
                </Container>
                <SettingsDialog open={settingsOpen} onClose={handleSettingsClose} />
            </Box>
        </ThemeProvider>
    );
}

export default App;