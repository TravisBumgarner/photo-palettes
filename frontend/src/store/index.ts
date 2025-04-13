import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { State } from "./types";

const useGlobalStore = create<State>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "store",
    }
  )
);

export default useGlobalStore;
