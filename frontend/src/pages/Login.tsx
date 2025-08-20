"use client";

import { Button, TextField, Typography } from "@mui/material";
import { type ChangeEvent, useCallback, useState } from "react";
import { z } from "zod";
import { MINIMUM_PASSWORD_LENGTH, ROUTES } from "../consts";
import { login } from "../services/supabase";
import useGlobalStore from "../store";
import { authFormCSS, PageTitle, PageWrapper } from "../styles/Shared";
import Link from "../sharedComponents/Link";
import { Navigate, useNavigate } from "react-router-dom";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const setTriggerFetchUser = useGlobalStore(
    (state) => state.setTriggerFetchUser
  );
  const appUserDetails = useGlobalStore((state) => state.appUserDetails);

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setPassword(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = LoginSchema.safeParse({
        email,
        password,
      });

      if (!result.success) {
        setError(result.error.message);
        return;
      }

      const response = await login({ email, password });
      console.log("ruda", response);
      if (response.success) {
        setTriggerFetchUser(true);
        navigate("/");
      } else {
        setError(response.error);
        navigate("/error500");
      }
    },
    [setTriggerFetchUser, navigate, email, password]
  );

  if (appUserDetails) {
    return <Navigate to="/" />;
  }

  return (
    <PageWrapper minHeight verticallyAlign width="small">
      <form onSubmit={handleSubmit} style={authFormCSS}>
        <PageTitle text="Log In" center />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <TextField
          id="email"
          name="email"
          type="email"
          required
          label="Email"
          autoComplete="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          label="Password"
          autoComplete="current-password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Log in
        </Button>
        <Typography variant="body1">
          {"Don't have an account? "}
          <Link href={ROUTES.signup.href}>{ROUTES.signup.label}</Link>.
        </Typography>
      </form>
    </PageWrapper>
  );
}
