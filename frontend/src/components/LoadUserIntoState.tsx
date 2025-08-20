"use client";

import { Box, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { getMe } from "../api/getMe";
import useGlobalStore from "../store";
import { PALETTE } from "../styles/styleConsts";
import Loading from "../sharedComponents/Loading";
import { getUser } from "../services/supabase";

export function LoadUserIntoStore() {
  const {
    setAuthId,
    isAppAuthenticating,
    setIsAppAuthenticating,
    setAppUserDetails,
  } = useGlobalStore((state) => ({
    setAuthId: state.setAuthId,
    isAppAuthenticating: state.isAppAuthenticating,
    setIsAppAuthenticating: state.setIsAppAuthenticating,
    setAppUserDetails: state.setAppUserDetails,
  }));

  useEffect(() => {
    if (!isAppAuthenticating) return;

    (async () => {
      const { user } = await getUser();
      setAuthId(user?.id ?? null);
      console.log("ruda", user?.id);
      const userDetails = await getMe();
      if (userDetails.success) setAppUserDetails(userDetails);

      setIsAppAuthenticating(false);
    })();
  }, [
    isAppAuthenticating,
    setAuthId,
    setAppUserDetails,
    setIsAppAuthenticating,
  ]);

  const isDark = useMediaQuery("(prefers-color-scheme: dark)");

  if (!isAppAuthenticating) return null;

  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "fixed",
        zIndex: 1000,
        backgroundColor: isDark
          ? PALETTE.grayscale[900]
          : PALETTE.grayscale[100],
      }}
    >
      <Loading />
    </Box>
  );
}
