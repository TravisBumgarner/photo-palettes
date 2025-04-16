"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "../../services/supabase/actions";
import useGlobalStore from "../../store";

export default function LogoutPage() {
  const router = useRouter();
  const setUser = useGlobalStore((state) => state.setUser);

  useEffect(() => {
    const logoutUser = async () => {
      setUser(null);
      const response = await logout();
      if (response?.success) {
        router.push("/");
      }
    };
    logoutUser();
  }, [router, setUser]);

  return <div>Logging out...</div>;
}
