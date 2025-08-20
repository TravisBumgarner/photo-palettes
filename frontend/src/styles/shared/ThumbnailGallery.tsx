import { Box } from "@mui/material";
import { SPACING } from "../styleConsts";
import React from "react";

const ThumbnailGridDisplay = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: SPACING.MEDIUM.PX,
        "@media (max-width: 768px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        "@media (max-width: 480px)": {
          gridTemplateColumns: "repeat(1, 1fr)",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ThumbnailGridDisplay;
