import { createUseExternalEvents } from "@mantine/utils";

import {
  ModalSettings,
  OpenConfirmModal,
  OpenContextModal,
  OpenFormModal,
} from "./context";

type ModalsEvents = {
  openModal(payload: ModalSettings): void;
  closeModal(id: string): void;
  closeAllModals(): void;
  openConfirmModal(payload: OpenConfirmModal): void;
  openFormModal(payload: OpenFormModal): void;
  openContextModal(payload: OpenContextModal & { modal: string }): void;
};

export const [useModalsEvents, createEvent] =
  //@ts-expect-error: temporary fix
  createUseExternalEvents<ModalsEvents>("mantine-modals");

export const openModal = createEvent("openModal");
export const closeModal = createEvent("closeModal");
export const closeAllModals = createEvent("closeAllModals");
export const openConfirmModal = createEvent("openConfirmModal");
export const openFormModal = createEvent("openFormModal");
export const openContextModal = createEvent("openContextModal");
