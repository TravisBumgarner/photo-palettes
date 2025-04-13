"use client";

import Link from "next/link";
import useGlobalStore from "../../store";

const Navigation = () => {
  const user = useGlobalStore((state) => state.user);

  return (
    <div>
      <Link href="/">Home</Link>
      {user ? (
        <Link href="/logout">Logout</Link>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </>
      )}
    </div>
  );
};

export default Navigation;
