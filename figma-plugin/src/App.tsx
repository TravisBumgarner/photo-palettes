import { createRoot } from "react-dom/client";
import Component from "./src-app/Component";
import Box from "@mui/material/Box";
import Icon from "./src-app/public/icon.png";
import "./src-app/styles/global.css";
import { Typography } from "@mui/material";
import AppThemeProvider from "./src-app/styles/Theme";
import Create from "./src-app/pages/Create";

function App() {
  return (
    <Box
      sx={{ width: "100vw", height: "100vh", bgcolor: "background.default" }}
    >
      <Typography variant="h1" align="center" sx={{ mt: 4, mb: 2 }}>
        Photo Palettes
      </Typography>
      <Typography
        variant="h6"
        align="center"
        sx={{ mb: 4, color: "text.secondary" }}
      >
        Find color inspiration in the everyday.
      </Typography>
      <img
        style={{ width: "40%", margin: "auto", display: "block" }}
        src={Icon}
        alt="Logo"
      />
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
