import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as Portal from "@radix-ui/react-portal";
import classNames from "classnames";
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ModalProps extends DialogPrimitive.DialogProps {
  className?: string;
  rootClassName?: string;
  isFullscreenModal?: boolean;
  outSideClickClose?: boolean;
}

// Exports
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;
export const ModalContent = DialogPrimitive.Content;
const ModalOverlay = DialogPrimitive.Overlay;

const Modal: FC<ModalProps> = ({
  children,
  open,
  className,
  onOpenChange,
  isFullscreenModal,
  rootClassName,
  outSideClickClose = true,
  ...props
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <AnimatePresence>
        {open && (
          <Portal.Root>
            <div
              className="relative z-40"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <ModalOverlay forceMount asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={classNames(
                    "fixed inset-0 bg-black/30 w-full h-full grid place-items-center overflow-auto sm:py-4 sm:px-0 p-8",
                    rootClassName
                  )}
                >
                  <ModalContent
                    forceMount
                    asChild
                    onPointerDownOutside={(e) => {
                      if (!outSideClickClose) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <div
                      className={classNames(
                        "bg-white rounded-xl shadow-lg relative",
                        {
                          "sm:w-[90%] sm:max-w-[460px] w-[460px]":
                            !isFullscreenModal,
                          "h-full w-full": isFullscreenModal,
                        },
                        open ? "ease-out duration-300" : "ease-in duration-200",
                        className
                      )}
                    >
                      {children}
                    </div>
                  </ModalContent>
                </motion.div>
              </ModalOverlay>
            </div>
          </Portal.Root>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default Modal;
