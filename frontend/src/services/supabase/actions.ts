"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "./server";

type Response = { success: true } | { error: string; success: false };

export async function login(formData: FormData): Promise<Response> {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData): Promise<Response> {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    return { error: error.message, success: false };
  }
  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout(): Promise<Response> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { success: true };
}
