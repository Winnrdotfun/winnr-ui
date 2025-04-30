import { FC } from "react";

interface StatusProps {
  title: string;
  variant: "success" | "warning" | "error";
}

const Status: FC<StatusProps> = ({ title, variant }) => {
  return (
    <div
      className={`py-1.5 pl-2 pr-2.5 rounded-3xl text-xs heading-h6 flex items-center gap-1 ${
        variant === "success"
          ? "bg-green-light/10 text-green-light"
          : variant === "warning"
          ? "bg-orange-light/10 text-orange-light"
          : "bg-red-light/10 text-red-light"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          variant === "success"
            ? "bg-green-light"
            : variant === "warning"
            ? "bg-orange-light"
            : "bg-red-light"
        }`}
      ></div>
      <span>{title}</span>
    </div>
  );
};

export default Status;
