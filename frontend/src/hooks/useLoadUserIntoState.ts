import { useEffect } from "react";
import useGlobalStore from "../store";
import { getUser } from "../services/supabase";
import { getMe } from "../api/getMe";

const useLoadUserIntoState = () => {
  const state = useGlobalStore();

  useEffect(() => {
    const loadUser = async () => {
      if (!state.triggerFetchUser) return;

      const { user } = await getUser();
      state.setAuthId(user?.id ?? null);
      const userDetails = await getMe();
      if (userDetails.success) state.setAppUserDetails(userDetails);

      state.setTriggerFetchUser(false);
    };
    loadUser();
  }, [state]);
};

export default useLoadUserIntoState;
