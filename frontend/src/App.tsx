import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Router from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import useLoadUserIntoState from "./hooks/useLoadUserIntoState";

const queryClient = new QueryClient();

function App() {
  useLoadUserIntoState();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navigation />
        <Router />
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
