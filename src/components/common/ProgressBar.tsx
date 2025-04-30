import { FC } from "react";

interface ProgressBarProps {
  totalSegments?: number;
  progress: number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  totalSegments = 15,
  progress,
}) => {
  const filledSegments = Math.floor((progress / 100) * totalSegments);

  return (
    <div className="flex gap-1">
      {[...Array(totalSegments)].map((_, index) => (
        <div
          key={index}
          className={`h-2.5 w-1 rounded-[1.5px] ${
            index < filledSegments ? "bg-green-light" : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
