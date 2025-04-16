"use client";

import { createClient } from "../../services/supabase/client";

const Authed = () => {
  const handleClick = async () => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const tokens = session?.data?.session?.access_token;

    const response = await fetch("http://localhost:8000/whoami", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokens}`,
      },
    });
    const json = await response.json();
    console.log(json.message);
  };

  return (
    <div>
      Authed<button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default Authed;
