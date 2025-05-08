import classNames from "classnames";
import { FC } from "react";
import styles from "./Toast.module.scss";
import { ReactComponent as Success } from "@/src/assets/icons/success-filled.svg";
import { ReactComponent as Error } from "@/src/assets/icons/error-filled.svg";
import { ReactComponent as Info } from "@/src/assets/icons/info.svg";
import { ReactComponent as Warning } from "@/src/assets/icons/toast-warning.svg";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: JSX.Element | string | null;
  onClose?: () => void;
  type: string;
}

const Toast: FC<ToastProps> = ({ message, type, onClose, ...props }) => {
  return (
    <div className={classNames(styles.toast, styles[type], props.className)}>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4">
          {type === "loading" ? (
            <Info />
          ) : type === "success" ? (
            <Success />
          ) : type === "error" ? (
            <Error />
          ) : (
            <Warning />
          )}
        </div>
        <div className="w-0 flex-1">
          <p className="heading-h5">{message}</p>
        </div>
        <button
          onClick={onClose}
          type="button"
          className={classNames("inline-flex w-4 h-4 mt-0.5", styles.close)}
        >
          <span className="sr-only">Close</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="#F9FAFA"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
