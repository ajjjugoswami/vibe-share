import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { store } from "./store";
import App from "./App.tsx";
import "./index.css";
import { useEffect, useState } from "react";

// Observe light/dark class changes on <html> to switch Ant Design theme
const ThemedApp = () => {
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains('light'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(!document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const antdTheme = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: "#ea580c",
      colorBgBase: isDark ? "#0c0f14" : "#f8f8f8",
      colorBgContainer: isDark ? "#12151c" : "#ffffff",
      colorBgElevated: isDark ? "#1a1e27" : "#ffffff",
      colorBorder: isDark ? "#1f2330" : "#e2e4e9",
      colorBorderSecondary: isDark ? "#1a1e27" : "#eef0f4",
      colorText: isDark ? "#fafafa" : "#111318",
      colorTextSecondary: isDark ? "#8b8fa3" : "#6b7085",
      colorTextTertiary: isDark ? "#5f6375" : "#9ca0b0",
      borderRadius: 8,
      fontFamily: "'Outfit', 'Inter', sans-serif",
    },
    components: {
      Button: {
        primaryShadow: "0 0 16px -4px rgba(234, 88, 12, 0.4)",
        borderRadius: 8,
      },
      Card: {
        colorBgContainer: isDark ? "#12151c" : "#ffffff",
      },
      Input: {
        colorBgContainer: isDark ? "#1a1e27" : "#f4f5f7",
        activeBorderColor: "#ea580c",
        borderRadius: 8,
      },
      Modal: {
        contentBg: isDark ? "#12151c" : "#ffffff",
        headerBg: isDark ? "#12151c" : "#ffffff",
      },
      Tabs: {
        itemSelectedColor: "#ea580c",
        inkBarColor: "#ea580c",
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <App />
    </ConfigProvider>
  );
};

// Apply saved mode on load before render
const savedMode = localStorage.getItem('Now Music-mode') || 'dark';
if (savedMode === 'light') {
  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemedApp />
  </Provider>
);
