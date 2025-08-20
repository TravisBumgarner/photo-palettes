"use client";

import { Typography } from "@mui/material";
import PageWrapper from "../styles/shared/PageWrapper";

import WhatWentWrongContactForm from "../sharedComponents/WhatWentWrongContactForm";

const Error500 = () => {
  return (
    <PageWrapper width="small" minHeight staticContent>
      <Typography variant="h2">
        Ohhh <span style={{ color: "#5AAAAD" }}>#5AAAAD</span>{" "}
        <span style={{ color: "#C000D3" }}>#C000D3</span>
      </Typography>
      <Typography>Something went wrong.</Typography>
      <WhatWentWrongContactForm />
    </PageWrapper>
  );
};

export default Error500;
