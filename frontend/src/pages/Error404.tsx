"use client";

import { Typography } from "@mui/material";
import PageWrapper from "../styles/shared/PageWrapper";

import WhatWentWrongContactForm from "../sharedComponents/WhatWentWrongContactForm";

const Error404 = () => {
  return (
    <PageWrapper width="small" minHeight staticContent>
      <Typography variant="h2">
        Ohhh <span style={{ color: "#5AAAAD" }}>#5AAAAD</span>{" "}
        <span style={{ color: "#C000D3" }}>#C000D3</span>
      </Typography>
      <Typography>The page you were looking for could not be found.</Typography>
      <WhatWentWrongContactForm />
    </PageWrapper>
  );
};

export default Error404;
