"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../services/supabase/client";
import useGlobalStore from "../../store";

export function LoadUserIntoStore() {
  const supabase = createClient();
  const setUser = useGlobalStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    loadUser();
    setIsLoading(false);
  }, [setUser, supabase]);

  return isLoading ? (
    <div
      style={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "fixed",
        background: "white",
      }}
    ></div>
  ) : null;
}
