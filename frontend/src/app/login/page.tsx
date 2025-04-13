"use client";

import { useState } from "react";
import { z } from "zod";
import { MINIMUM_PASSWORD_LENGTH } from "../../consts";
import { login } from "../../services/supabase/actions";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

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

    await login(formData);
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
