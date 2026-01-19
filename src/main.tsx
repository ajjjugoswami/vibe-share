import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { store } from "./store";
import App from "./App.tsx";
import "./index.css";

// Custom dark theme for Ant Design
const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#8b5cf6",
    colorBgBase: "#0a0a0f",
    colorBgContainer: "#111116",
    colorBgElevated: "#1a1a22",
    colorBorder: "#27272a",
    colorBorderSecondary: "#1f1f24",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    colorTextTertiary: "#71717a",
    borderRadius: 12,
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    Button: {
      primaryShadow: "0 0 20px -5px rgba(139, 92, 246, 0.4)",
    },
    Card: {
      colorBgContainer: "#111116",
    },
    Input: {
      colorBgContainer: "#1a1a22",
      activeBorderColor: "#8b5cf6",
    },
    Modal: {
      contentBg: "#111116",
      headerBg: "#111116",
    },
  },
};

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider theme={antdTheme}>
      <App />
    </ConfigProvider>
  </Provider>
);