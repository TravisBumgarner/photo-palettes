import { createRoot } from "react-dom/client";
import Component from "./src-app/Component";
import Box from "@mui/material/Box";
import Icon from "./src-app/public/icon.png";
import "./src-app/styles/global.css";
import { Typography } from "@mui/material";
import AppThemeProvider from "./src-app/styles/Theme";
import Create from "./src-app/pages/Create";
import { SPACING } from "./src-app/styles/styleConsts";

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
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: SPACING.SMALL.PX,
          mb: SPACING.MEDIUM.PX,
        }}
      >
        <Box>
          <img style={{ height: "50px" }} src={Icon} alt="Logo" />
        </Box>
        <Box>
          <Typography variant="h1">Photo Palettes</Typography>
          <Typography variant="body1">
            Find color inspiration in the everyday.
          </Typography>
        </Box>
      </Box> */}
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
