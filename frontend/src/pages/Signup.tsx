"use client";

import { Button, TextField, Typography } from "@mui/material";
import { type ChangeEvent, useCallback, useState } from "react";
import { z } from "zod";
import { MINIMUM_PASSWORD_LENGTH, ROUTES } from "../consts";
import { signup } from "../services/supabase";
import useGlobalStore from "../store";
import { authFormCSS, PageTitle, PageWrapper } from "../styles/Shared";
import Link from "../sharedComponents/Link";
import { Navigate, useNavigate } from "react-router-dom";

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
  repeatPassword: z.string().min(MINIMUM_PASSWORD_LENGTH),
});

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const appUserDetails = useGlobalStore((state) => state.appUserDetails);
  const setIsAppAuthenticating = useGlobalStore(
    (state) => state.setIsAppAuthenticating
  );
  const setActiveModal = useGlobalStore((state) => state.setActiveModal);

  const navigate = useNavigate();

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const newPassword = e.target.value;
      setPassword(newPassword);
    },
    [setPassword]
  );

  const handleRepeatPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const newRepeatPassword = e.target.value;
      setRepeatPassword(newRepeatPassword);
    },
    [setRepeatPassword]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (password !== repeatPassword) {
        setError("Passwords do not match");
        return;
      }

      const result = SignupSchema.safeParse({
        email,
        password,
        repeatPassword,
      });
      if (!result.success) {
        setError(result.error.message);
        return;
      }

      try {
        const response = await signup({ email, password });
        if (response.success) {
          setIsAppAuthenticating(true);
          setActiveModal({
            id: "ConfirmationModal",
            title: "Signup Successful",
            body: "Check your email for a confirmation.",
            confirmationCallback: () => {
              navigate("/");
            },
          });
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred during signup"
        );
      }
    },
    [
      email,
      password,
      repeatPassword,
      setIsAppAuthenticating,
      setActiveModal,
      navigate,
    ]
  );

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setEmail(e.target.value);
    },
    [setEmail]
  );

  if (appUserDetails) {
    return <Navigate to="/" />;
  }

  return (
    <PageWrapper minHeight verticallyAlign width="small">
      <form onSubmit={handleSubmit} style={authFormCSS}>
        <PageTitle center text="Sign Up" />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <TextField
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={handleEmailChange}
          label="Email"
          fullWidth
          autoComplete="email"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={handlePasswordChange}
          label="Password"
          fullWidth
          autoComplete="new-password"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          id="repeatPassword"
          name="repeatPassword"
          type="password"
          required
          value={repeatPassword}
          onChange={handleRepeatPasswordChange}
          label="Repeat Password"
          fullWidth
          autoComplete="new-password"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <Button
          variant="contained"
          disabled={!password || !repeatPassword || !email}
          type="submit"
          fullWidth
        >
          Sign up
        </Button>
        <Typography variant="body1">
          {"Have have an account? "}
          <Link href={ROUTES.login.href}>{ROUTES.login.label}</Link>.
        </Typography>
      </form>
    </PageWrapper>
  );
}
