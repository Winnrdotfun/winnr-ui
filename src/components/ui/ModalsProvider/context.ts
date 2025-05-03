import { createContext, ReactNode } from "react";

import { ModalProps } from "@ui/Modal/Modal";

import type { ConfirmModalProps } from "./ConfirmModal";

export type ModalSettings = Partial<Omit<ModalProps, "open">> & {
  modalId?: string;
};

export type ConfirmLabels = Record<"confirm" | "cancel", ReactNode>;

export interface OpenConfirmModal
  extends Omit<ModalSettings, "children">,
    ConfirmModalProps {}

export interface OpenFormModal
  extends Omit<ModalSettings, "children">,
    ConfirmModalProps {}
export interface OpenContextModal<
  CustomProps extends Record<string, unknown> = Record<string, unknown>
> extends ModalSettings {
  innerProps: CustomProps;
}

export interface ContextModalProps<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  context: ModalsContextProps;
  innerProps: T;
  id: string;
}

export type ModalState =
  | { id: string; props: ModalSettings; type: "content" }
  | { id: string; props: OpenConfirmModal; type: "confirm" }
  | { id: string; props: OpenFormModal; type: "form" }
  | { id: string; props: OpenContextModal; type: "context"; ctx: string };

export interface ModalsContextProps {
  modals: ModalState[];
  openModal: (props: ModalSettings) => string;
  openConfirmModal: (props: OpenConfirmModal) => string;
  openFormModal: (props: OpenFormModal) => string;
  openContextModal: <CustomProps extends Record<string, unknown>>(
    modal: string,
    props: OpenContextModal<CustomProps>
  ) => string;
  closeModal: (id: string, canceled?: boolean) => void;
  closeAll: () => void;
}

export const ModalsContext = createContext<ModalsContextProps>({
  modals: [],
  openModal: () => "",
  openConfirmModal: () => "",
  openFormModal: () => "",
  openContextModal: () => "",
  closeModal: () => {},
  closeAll: () => {},
});
ModalsContext.displayName = "ModalsContext";
