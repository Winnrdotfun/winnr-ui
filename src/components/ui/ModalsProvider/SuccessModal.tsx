import Button, { ButtonProps } from "@ui/Button/Button";
import { closeModal, openModal, useModals } from "@ui/ModalsProvider";
import { FC, ReactNode, useCallback } from "react";
import { ReactComponent as Tick } from "@/assets/icons/tick.svg";

interface SuccessModalProps {
  id?: string;
  title?: string;
  children?: ReactNode;
  cancelButtonProps?: ButtonProps;
  successButtonProps?: ButtonProps;
  labels?: Record<"send" | "close", ReactNode>;
  onSuccess?(): void;
  closeOnSuccess?: boolean;
}

const SuccessModal: FC<SuccessModalProps> = ({
  id,
  title,
  children,
  cancelButtonProps,
  successButtonProps,
  labels,
  closeOnSuccess = true,
  onSuccess,
}) => {
  const { send: sendLabel, close: closeLabel } = labels || {
    send: "Send",
    close: "Close",
  };
  const ctx = useModals();

  const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (typeof successButtonProps?.onClick === "function")
      successButtonProps.onClick(event);
    if (typeof onSuccess === "function") onSuccess();
    if (closeOnSuccess && id) ctx.closeModal(id);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden pt-11 text-center">
      <div className="px-5 flex flex-col items-center gap-3 mb-8">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center relative z-10 scale-75">
            <Tick className="w-6 h-6" />
          </div>
          <span className="animate-ping-slow delay-[2000ms] absolute inline-flex h-8 w-8 rounded-full bg-green-100"></span>
        </div>
        <div>
          <h3 className="header-h5 text-gray-1000 mb-1">{title}</h3>
          {children}
        </div>
      </div>
      <div className="gap-3 flex items-center px-5 py-4 border-t border-gray-50 w-full">
        <Button variant="secondary" className="flex-1" onClick={handleSend}>
          {successButtonProps?.children || sendLabel}
        </Button>
        <Button
          {...cancelButtonProps}
          onClick={() => closeModal("SuccessModal")}
          className="flex-1"
        >
          {cancelButtonProps?.children || closeLabel}
        </Button>
      </div>
    </div>
  );
};

export const SuccessModalId = "SuccessModal";

export const useSuccessModal = () => {
  const openSuccessModal = useCallback(
    (props: SuccessModalProps = {}) =>
      openModal({
        modalId: SuccessModalId,
        children: <SuccessModal {...props} />,
      }),
    []
  );

  return {
    SuccessModalId,
    openSuccessModal,
  };
};

export default SuccessModal;
