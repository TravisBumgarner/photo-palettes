import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";

function App() {
  return (
    <BrowserRouter>
      <Footer />
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
