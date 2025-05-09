import { FC, useCallback } from "react";
import { openModal } from "@ui/ModalsProvider";
import InputOtp from "../ui/Input/InputOtp";
import Button from "../ui/Button/Button";
import { ReactComponent as ArrowRight } from "@/src/assets/icons/arrow-right.svg";
import { ReactComponent as X } from "@/src/assets/icons/x.svg";
import { ReactComponent as Telegram } from "@/src/assets/icons/telegram.svg";
import Link from "next/link";

const ModalInviteCode: FC = () => {
  return (
    <div className="py-4 px-3 text-center">
      <div className="pb-5 mb-5 border-b border-white/10">
        <div className="mb-6">
          <h3 className="heading-h3 text-neutral-50 mb-1">Invite Code</h3>
          <p className="body-sm text-neutral-500">
            Winnr is currently invite-only
          </p>
        </div>
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="Enter Code" className="body-sm text-neutral-50 mb-2">
            Enter Code
          </label>
          <div className="max-w-[156px]">
            <InputOtp
              shouldAutoFocus
              value="asas"
              onChange={() => {}}
              numInputs={4}
              renderInput={(props) => <input {...props} />}
            />
          </div>
        </div>
        <Button className="w-full" size="sm" iconRight={<ArrowRight />}>
          Submit
        </Button>
      </div>
      <div>
        <h5 className="heading-h5 mb-1 text-neutral-50">
          Don’t have invite code?
        </h5>
        <p className="body-xs text-neutral-500 mb-4">
          Join our community, we will share more invites.
        </p>
        <div className="flex justify-center items-center gap-2">
          <Link href="/" className="body-sm text-neutral-500">
            <X />
          </Link>
          <Link href="/" className="body-sm text-neutral-500">
            <Telegram />
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ModalInviteCodeId = "ModalInviteCode";

export const useModalInviteCode = () => {
  const openModalInviteCode = useCallback(
    (props = {}) =>
      openModal({
        modalId: ModalInviteCodeId,
        children: <ModalInviteCode {...props} />,
        className: "w-[288px]",
      }),
    []
  );

  return {
    ModalInviteCodeId,
    openModalInviteCode,
  };
};

export default ModalInviteCode;
