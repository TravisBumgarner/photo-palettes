"use client";

import { useQuery } from "@tanstack/react-query";
import { callBackend } from "../lib/api/test";
import styles from "./page.module.css";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["callBackend"],
    queryFn: callBackend,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.page}>
      <p>Hello World.</p>
      <button onClick={callBackend}>Call Backend</button>
      <p>{data}</p>
    </div>
  );
}
