import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Router from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useLoadUserIntoState from "./hooks/useLoadUserIntoState";
import useGlobalStore from "./store";
import { Box } from "@mui/material";
import Loading from "./sharedComponents/Loading";
import AppThemeProvider from "./styles/Theme";
import AlertsManager from "./components/AlertsManager";

const queryClient = new QueryClient();
function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error("This is your first error!");
      }}
    >
      Break the world
    </button>
  );
}
function App() {
  useLoadUserIntoState();
  const loadingUser = useGlobalStore((state) => state.loadingUser);

  if (loadingUser) {
    return (
      <Box
        sx={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          position: "fixed",
          zIndex: 1000,
          backgroundColor: "background.paper",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorButton />
      <BrowserRouter>
        <AlertsManager />
        <Navigation />
        <Router />
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

const WrappedApp = () => {
  return (
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  );
};

export default WrappedApp;
