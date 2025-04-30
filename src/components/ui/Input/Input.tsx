import classNames from "classnames";
import { FC, forwardRef } from "react";
import styles from "./Input.module.scss";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  placeholder?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, error, ...props }, forwardedRef) => {
    return (
      <div className="relative">
        <input
          ref={forwardedRef}
          className={classNames(
            styles.input,
            { [styles.error]: error },
            className
          )}
          {...props}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
