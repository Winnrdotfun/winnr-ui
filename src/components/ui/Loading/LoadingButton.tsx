import { FC } from "react";

interface LoadingButtonProps {
  className?: string;
}

const LoadingButton: FC<LoadingButtonProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-[124px] h-[37px] bg-neutral-900 rounded-xl animate-pulse ${className}`}
    />
  );
};

export default LoadingButton;
