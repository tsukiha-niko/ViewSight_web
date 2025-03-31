import { createTheme } from '@mui/material/styles';

// 阴影管理工具函数
const elevation = (level, mode) => {
  const darkShadows = [
    'none',
    '0 1px 2px rgba(0,0,0,0.2)',
    '0 2px 4px rgba(0,0,0,0.3)',
    '0 4px 8px rgba(0,0,0,0.4)',
    '0 8px 16px rgba(0,0,0,0.5)'
  ];
  
  const lightShadows = [
    'none',
    '0 1px 2px rgba(0,0,0,0.1)',
    '0 2px 4px rgba(0,0,0,0.15)',
    '0 4px 8px rgba(0,0,0,0.2)',
    '0 8px 16px rgba(0,0,0,0.25)'
  ];
  
  return mode === 'dark' ? darkShadows[level] : lightShadows[level];
};

// 创建主题
export const createAppTheme = (mode) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'dark' ? '#1e88e5' : '#1976d2', // 更沉稳的蓝色
        contrastText: '#ffffff',
      },
      secondary: {
        main: mode === 'dark' ? '#90caf9' : '#64b5f6', // 辅助色更柔和
        contrastText: mode === 'dark' ? '#121212' : '#ffffff',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5', // 暗黑模式更深，浅色模式更柔和
        paper: mode === 'dark' ? '#1c1c1c' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
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
      fontSize: 14, // 默认字体大小
      h1: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
      },
    },
    shape: {
      borderRadius: 2, // 更小的圆角
    },
    transitions: {
      create: (props = ['all'], options = {}) => {
        const properties = Array.isArray(props) ? props : [props];
        return properties
          .map((p) => `${p} 250ms cubic-bezier(0.4, 0, 0.2, 1)`)
          .join(', ');
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? '#1c1c1c' : '#ffffff', // 更沉稳的背景
            color: mode === 'dark' ? '#ffffff' : '#000000',
            boxShadow: elevation(2, mode),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#1c1c1c' : '#ffffff',
            boxShadow: elevation(1, mode),
            borderRadius: '8px',
            transition: 'box-shadow 250ms ease',
            '&:hover': {
              boxShadow: elevation(3, mode),
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 16px',
            borderRadius: '6px',
            transition: 'all 250ms ease',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#333333' : '#e0e0e0',
            },
          },
          contained: {
            boxShadow: elevation(1, mode),
            '&:hover': {
              boxShadow: elevation(2, mode),
            },
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 250ms ease',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
      },
    },
  });
};