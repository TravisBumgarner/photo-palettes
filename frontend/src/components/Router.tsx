import { Routes, Route } from "react-router-dom";
import Browse from "../pages/Browse";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Changelog from "../pages/Changelog";
import Feedback from "../pages/Feedback";
import Create from "../pages/Create/Create";
import Login from "../pages/Login";
import Error500 from "../pages/Error500";
import Error404 from "../pages/Error404";
import FeatureRequests from "../pages/FeatureRequests";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import Logout from "../pages/Logout";
import Moderation from "../pages/Moderation";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Browse />} />
      <Route path="/tos" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/changelog" element={<Changelog />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/create" element={<Create />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/error500" element={<Error500 />} />
      <Route path="/error404" element={<Error404 />} />
      <Route path="/feature_requests" element={<FeatureRequests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/moderation" element={<Moderation />} />
    </Routes>
  );
};

export default Router;
