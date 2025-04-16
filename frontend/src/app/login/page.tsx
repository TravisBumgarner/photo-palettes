"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { MINIMUM_PASSWORD_LENGTH } from "../../consts";
import { login } from "../../services/supabase/actions";
import useGlobalStore from "../../store";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setIsAppAuthenticating = useGlobalStore(
    (state) => state.setIsAppAuthenticating
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const result = LoginSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    const response = await login(formData);
    if (response.success) {
      setIsAppAuthenticating(true);
      router.push("/");
    } else {
      setError(response.error);
      router.push("/error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button type="submit">Log in</button>
    </form>
  );
}
