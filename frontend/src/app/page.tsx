"use client";

import useGlobalStore from "../store";

export default function PrivatePage() {
  const user = useGlobalStore((state) => state.user);

  return <p>Hello {user?.email}</p>;
}
