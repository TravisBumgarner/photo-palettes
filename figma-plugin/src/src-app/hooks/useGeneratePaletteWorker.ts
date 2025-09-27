// import { useRef } from "react";
// import type { TGeneratePaletteResponse } from "../types";

export function useGeneratePaletteWorker() {
  // const workerRef = useRef<Worker | null>(null);

  // if (!workerRef.current) {
  //   workerRef.current = new Worker(
  //     new URL("../workers/generatePaletteWorker.ts", import.meta.url),
  //     { type: "module" }
  //   );
  // }

  // function generatePalette(
  //   photoUrl: string
  // ): Promise<TGeneratePaletteResponse> {
  //   return new Promise((resolve) => {
  //     const id = Math.random().toString(36);
  //     const handleMessage = (event: MessageEvent) => {
  //       if (event.data.id === id) {
  //         resolve(event.data.response);
  //         workerRef.current?.removeEventListener("message", handleMessage);
  //       }
  //     };
  //     workerRef.current?.addEventListener("message", handleMessage);
  //     workerRef.current?.postMessage({ id, photoUrl });
  //   });
  // }

  const generatePalette = () => {
    alert("loaded");
  };

  return { generatePalette };
}
