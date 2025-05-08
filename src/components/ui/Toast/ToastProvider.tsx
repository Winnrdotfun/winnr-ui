"use client";

import toast, { Toaster, resolveValue } from "react-hot-toast";
import Toast from "./Toast";

export const showToast = toast;
export const removeToast = toast.remove;

const ToastProvider = () => {
  return (
    <Toaster position="bottom-right" containerStyle={{ bottom: 22, right: 22 }}>
      {(t) => (
        <Toast
          key={t.id}
          message={resolveValue(t.message, t)}
          type={t.type}
          onClose={() => toast.remove(t.id)}
        />
      )}
    </Toaster>
  );
};

export default ToastProvider;
