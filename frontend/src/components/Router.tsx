import { Routes, Route } from "react-router-dom";
import Browse from "../pages/Browse";
import TermsOfService from "../pages/TermsOfServices";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Changelog from "../pages/Changelog";
import Feedback from "../pages/Feedback";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Browse />} />
      <Route path="/tos" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
};

export default Router;
