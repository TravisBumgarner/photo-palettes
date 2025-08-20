import { type User } from "@supabase/supabase-js";
import type { EPermissionLevel } from "../types";
// import { ActiveModal } from '../app/_sharedComponents/Modal/Modal.types'

export interface AppUserDetails {
  permissionLevel: EPermissionLevel;
  displayName: string;
  email: string;
  id: string;
}

export interface TAlert {
  message: string;
  color: "info" | "error" | "success";
  id: number;
}

export interface State {
  authId: User["id"] | null;
  setAuthId: (authId: User["id"] | null) => void;
  isAppAuthenticating: boolean;
  setIsAppAuthenticating: (isAppAuthenticating: boolean) => void;
  appUserDetails: AppUserDetails | null;
  setAppUserDetails: (appUserDetails: AppUserDetails | null) => void;
  alerts: TAlert[];
  getAndRemoveNextAlert: () => TAlert | null;
  addAlert: (text: string, color: "info" | "error" | "success") => void;
  // activeModal: null | ActiveModal
  // setActiveModal: (activeModal: ActiveModal | null) => void
}
