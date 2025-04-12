"use client";

import { useMutation } from "@tanstack/react-query";
import { callBackend } from "../lib/api/test";
import styles from "./page.module.css";

export default function Home() {
  const { mutate, data, isPending, error } = useMutation({
    mutationFn: callBackend,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.page}>
      <p>Hello World.</p>
      <button onClick={() => mutate()}>Call Backend</button>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
