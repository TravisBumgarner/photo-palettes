import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Router from "./components/Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { LoadUserIntoStore } from "./components/LoadUserIntoState";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <LoadUserIntoStore /> */}
        <Navigation />
        <Router />
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
