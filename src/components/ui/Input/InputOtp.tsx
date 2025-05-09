import classNames from "classnames";
import { FC } from "react";
import OTPInput, { OTPInputProps } from "react-otp-input";
import styles from "./Input.module.scss";

const InputOtp: FC<OTPInputProps> = ({ ...props }) => {
  return (
    <OTPInput
      shouldAutoFocus
      containerStyle={classNames("flex gap-1")}
      inputStyle={classNames(styles.input, "!px-2 !h-9 !w-full")}
      {...props}
    />
  );
};

InputOtp.displayName = "InputOtp";

export default InputOtp;
