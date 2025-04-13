"use client";

import { useEffect } from "react";
import { logout } from "../../services/supabase/actions";

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return <div>Logging out...</div>;
}
