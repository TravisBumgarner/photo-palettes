import { Typography } from "@mui/material";
import { useEffect } from "react";
import { logout } from "../services/supabase";
import useGlobalStore from "../store";
import PageTitle from "../styles/shared/PageTitle";
import PageWrapper from "../styles/shared/PageWrapper";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const setAuthId = useGlobalStore((state) => state.setAuthId);
  const setAppUserDetails = useGlobalStore((state) => state.setAppUserDetails);

  useEffect(() => {
    const logoutUser = async () => {
      setAuthId(null);
      setAppUserDetails(null);
      const response = await logout();
      if (response?.success) {
        navigate("/");
      }
    };
    logoutUser();
  }, [navigate, setAuthId, setAppUserDetails]);

  return (
    <PageWrapper width="small">
      <PageTitle center text="Signing out..." />
      <Typography style={{ textAlign: "center" }}>See you soon!</Typography>
    </PageWrapper>
  );
}
