"use client";

import React, { useReducer } from "react";

import { randomId } from "@mantine/hooks";
import Modal from "@ui/Modal/Modal";

import { ConfirmModal } from "./ConfirmModal";
import { FormModal } from "./FormModal";
import {
  ConfirmLabels,
  ContextModalProps,
  ModalsContext,
  ModalsContextProps,
  ModalSettings,
  OpenConfirmModal,
  OpenContextModal,
  OpenFormModal,
} from "./context";
import { useModalsEvents } from "./events";
import { modalsReducer } from "./reducer";

export interface ModalsProviderProps {
  /** Your app */
  children: React.ReactNode;

  /** Predefined modals */
  modals?: Record<string, React.FC<ContextModalProps<Record<string, unknown>>>>;

  /** Shared Modal component props, applied for every modal */
  modalProps?: ModalSettings;

  /** Confirm modal labels */
  labels?: ConfirmLabels;
}

function separateConfirmModalProps(props: OpenConfirmModal) {
  if (!props) {
    return { confirmProps: {}, modalProps: {} };
  }

  const {
    id,
    title,
    children,
    onCancel,
    onConfirm,
    closeOnConfirm,
    closeOnCancel,
    cancelProps,
    confirmProps,
    labels,
    ...others
  } = props;

  return {
    confirmProps: {
      id,
      title,
      children,
      onCancel,
      onConfirm,
      closeOnConfirm,
      closeOnCancel,
      cancelProps,
      confirmProps,
      labels,
    },
    modalProps: {
      id,
      ...others,
    },
  };
}

export function ModalsProvider({
  children,
  modalProps,
  labels,
  modals,
}: ModalsProviderProps) {
  const [state, dispatch] = useReducer(modalsReducer, {
    modals: [],
    current: null,
  });
  const closeAll = (canceled?: boolean) => {
    state.modals.forEach((modal) => {
      if (modal.type === "confirm" && canceled) {
        modal.props?.onCancel?.();
      }

      modal.props?.onOpenChange?.(false);
    });
    dispatch({ type: "CLOSE_ALL" });
  };

  const openModal = ({ modalId, ...props }: ModalSettings) => {
    const id = modalId || randomId();

    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "content",
        props,
      },
    });
    return id;
  };

  const openConfirmModal = ({ modalId, ...props }: OpenConfirmModal) => {
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "confirm",
        props,
      },
    });
    return id;
  };

  const openFormModal = ({ modalId, ...props }: OpenFormModal) => {
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "form",
        props,
      },
    });
    return id;
  };

  const openContextModal = (
    modal: string,
    { modalId, ...props }: OpenContextModal
  ) => {
    const id = modalId || randomId();
    dispatch({
      type: "OPEN",
      payload: {
        id,
        type: "context",
        props,
        ctx: modal,
      },
    });
    return id;
  };

  const closeModal = (id: string, canceled?: boolean) => {
    if (state.modals.length <= 1) {
      closeAll(canceled);
      return;
    }

    const modal = state.modals.find((item) => item.id === id);
    if (!modal) return;

    if (modal?.type === "confirm" && canceled) {
      modal.props?.onCancel?.();
    }
    modal?.props?.onOpenChange?.(false);
    dispatch({ type: "CLOSE", payload: modal.id });
  };

  useModalsEvents({
    openModal,
    openConfirmModal,
    openFormModal,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openContextModal: ({ modal, ...payload }) =>
      openContextModal(modal, payload),
    closeModal,
    closeAllModals: closeAll,
  });

  const ctx: ModalsContextProps = {
    modals: state.modals,
    openModal,
    openConfirmModal,
    openFormModal,
    openContextModal,
    closeModal,
    closeAll,
  };

  const getCurrentModal = () => {
    switch (state.current?.type) {
      case "context": {
        const { innerProps, ...rest } = state.current.props;
        const ContextModal = modals?.[state.current.ctx];
        if (!ContextModal) return null;

        return {
          modalProps: rest,
          content: (
            <ContextModal
              innerProps={innerProps}
              context={ctx}
              id={state.current.id}
            />
          ),
        };
      }
      case "confirm": {
        const {
          modalProps: separatedModalProps,
          confirmProps: separatedConfirmProps,
        } = separateConfirmModalProps(state.current.props);

        return {
          modalProps: separatedModalProps,
          content: (
            <ConfirmModal
              {...separatedConfirmProps}
              id={state.current.id}
              title={state.current.props.title}
              labels={state.current.props.labels || labels}
            >
              {state.current.props.children}
            </ConfirmModal>
          ),
        };
      }
      case "form": {
        const {
          modalProps: separatedModalProps,
          confirmProps: separatedConfirmProps,
        } = separateConfirmModalProps(state.current.props);

        return {
          modalProps: separatedModalProps,
          content: (
            <FormModal
              {...separatedConfirmProps}
              id={state.current.id}
              title={state.current.props.title}
              labels={state.current.props.labels || labels}
            >
              {state.current.props.children}
            </FormModal>
          ),
        };
      }
      case "content": {
        const { children: currentModalChildren, ...rest } = state.current.props;

        return {
          modalProps: rest,
          content: <>{currentModalChildren}</>,
        };
      }
      default: {
        return {
          modalProps: {},
          content: null,
        };
      }
    }
  };

  const { modalProps: currentModalProps, content } = getCurrentModal() || {
    modalProps: {},
    content: null,
  };

  return (
    <ModalsContext.Provider value={ctx}>
      {children}

      <Modal
        {...modalProps}
        {...currentModalProps}
        open={state.modals.length > 0}
        onOpenChange={(open) => {
          if (!open && state.current) {
            closeModal(state.current.id);
          }
        }}
      >
        {content}
      </Modal>
    </ModalsContext.Provider>
  );
}
