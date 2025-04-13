"use client";

import { useEffect } from "react";
import { createClient } from "../../services/supabase/client";
import useGlobalStore from "../../store";

export function LoadUserIntoStore() {
  const supabase = createClient();
  const setUser = useGlobalStore((state) => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();
  }, [setUser, supabase]);

  return null;
}
