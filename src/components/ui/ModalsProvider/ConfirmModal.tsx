import React from "react";

import Button, { ButtonProps } from "@ui/Button/Button";

import { ConfirmLabels } from "./context";
import { useModals } from "./use-modals/use-modals";

export interface ConfirmModalProps {
  id?: string;
  title: React.ReactNode | string;
  children: React.ReactNode;
  onCancel?(): void;
  onConfirm?(): void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  cancelProps?: ButtonProps;
  confirmProps?: ButtonProps;
  labels?: ConfirmLabels;
  isLoading?: boolean;
}

export function ConfirmModal({
  id,
  title,
  cancelProps,
  confirmProps,
  labels = { cancel: "", confirm: "" },
  closeOnConfirm = true,
  closeOnCancel = true,
  onCancel,
  onConfirm,
  children,
  isLoading = false,
}: ConfirmModalProps) {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;
  const ctx = useModals();

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof cancelProps?.onClick === "function") cancelProps.onClick(event);
    if (typeof onCancel === "function") onCancel();
    if (closeOnCancel && id) ctx.closeModal(id);
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof confirmProps?.onClick === "function")
      confirmProps.onClick(event);
    if (typeof onConfirm === "function") onConfirm();
    if (closeOnConfirm && id) ctx.closeModal(id);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="text-center p-4">
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
      <div className="gap-3 flex items-center px-5 py-4">
        {cancelProps?.children && (
          <Button
            variant="secondary"
            {...cancelProps}
            onClick={handleCancel}
            className="flex-1"
          >
            {cancelProps?.children || cancelLabel}
          </Button>
        )}
        <Button
          {...confirmProps}
          onClick={handleConfirm}
          isLoading={isLoading}
          autoFocus
          className="flex-1"
        >
          {confirmProps?.children || confirmLabel}
        </Button>
      </div>
    </div>
  );
}
