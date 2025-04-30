import { ReactComponent as BackArrow } from "@/src/assets/icons/arrow-back.svg";
import Link from "next/link";
import { FC } from "react";

interface BackButtonProps {
  href: string;
}

const BackButton: FC<BackButtonProps> = ({ href }) => {
  return (
    <Link href={href} className="flex items-center gap-1">
      <BackArrow />
      <span className="heading-h4 text-white/60">Back</span>
    </Link>
  );
};

export default BackButton;
