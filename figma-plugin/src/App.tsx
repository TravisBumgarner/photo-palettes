import { createRoot } from "react-dom/client";
import Box from "@mui/material/Box";
import "./src-app/styles/global.css";
import AppThemeProvider from "./src-app/styles/Theme";
import Create from "./src-app/pages/Create";
import { SPACING } from "./src-app/styles/styleConsts";
import * as Sentry from "@sentry/react";

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
