import Button, { ButtonProps } from "@ui/Button/Button";
import { closeModal, openModal } from "@ui/ModalsProvider";
import { FC, ReactNode, useCallback } from "react";
import { ReactComponent as ErrorIcon } from "@/assets/icons/error-filled.svg";

interface ErrorModalProps {
  id?: string;
  title?: string;
  children?: ReactNode;
  cancelButtonProps?: ButtonProps;
  onErrorButtonProps?: ButtonProps;
  labels?: Record<"error" | "close", ReactNode>;
  onError?: () => void;
  closeOnError?: boolean;
}

const ErrorModal: FC<ErrorModalProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  title,
  children,
  cancelButtonProps,
  onErrorButtonProps,
  labels,
  closeOnError = true,
  onError,
}) => {
  //@ts-expect-error: temporary fix
  const { error: errorActionLabel, close: closeLabel } = labels;

  const handleSend = (event: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    typeof onErrorButtonProps?.onClick === "function" &&
      onErrorButtonProps?.onClick(event);
    onError?.();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    closeOnError && closeModal("ErrorModal");
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden pt-11 text-center">
      <div className="px-5 flex flex-col items-center gap-3 mb-8">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full  flex items-center justify-center relative z-10">
            <ErrorIcon className="w-10 h-10" />
          </div>
        </div>
        <div>
          <h3 className="header-h5 text-gray-1000 mb-1">{title}</h3>
          {children}
        </div>
      </div>
      <div className="gap-3 flex items-center px-5 py-4 border-t border-gray-50 w-full">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={handleSend}
          {...onErrorButtonProps}
        >
          {onErrorButtonProps?.children || errorActionLabel}
        </Button>
        <Button
          {...cancelButtonProps}
          onClick={() => closeModal("ErrorModal")}
          className="flex-1"
        >
          {cancelButtonProps?.children || closeLabel}
        </Button>
      </div>
    </div>
  );
};

export const ErrorModalId = "ErrorModal";

export const useErrorModal = () => {
  const openErrorModal = useCallback(
    (props: ErrorModalProps = {}) =>
      openModal({
        modalId: ErrorModalId,
        children: <ErrorModal {...props} />,
      }),
    []
  );

  return {
    ErrorModalId,
    openErrorModal,
  };
};

export default ErrorModal;
