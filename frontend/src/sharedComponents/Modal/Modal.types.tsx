import { type ConfirmationModalProps } from "./components/ConfirmationModal";

export type ModalID = "ConfirmationModal";

export type ActiveModal = {
  id: ModalID;
} & ConfirmationModalProps;
