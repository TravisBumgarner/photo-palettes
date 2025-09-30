import { createRoot } from "react-dom/client";
import Box from "@mui/material/Box";
import "./src-app/styles/global.css";
import AppThemeProvider from "./src-app/styles/Theme";
import Create from "./src-app/pages/Create";
import { SPACING } from "./src-app/styles/styleConsts";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://0cc7281ca80d476d7240e129a28263a3@o196886.ingest.us.sentry.io/4510110002380800",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

function App() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        padding: SPACING.MEDIUM.PX,
        bgcolor: "background.default",
      }}
    >
      <Create mode="lite" />
    </Box>
  );
}

const AppWrapper = () => (
  <AppThemeProvider>
    <App />
  </AppThemeProvider>
);

createRoot(document.getElementById("root")!).render(<AppWrapper />);
