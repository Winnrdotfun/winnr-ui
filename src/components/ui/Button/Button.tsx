import classNames from "classnames";
import React, { FC, forwardRef, ReactNode } from "react";

import Icon from "../Icon/Icon";
import styles from "./Button.module.scss";
import Loading from "../Loading/Loading";

export type ButtonType = "button" | "submit" | "reset";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "link"
  | "danger";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  iconLeft?: FC | ReactNode;
  iconRight?: FC | ReactNode;
  iconOnly?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  // If Link
  component?: React.ElementType;
  href?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
  isSpinner?: boolean;
}

const getVariant = (variant: ButtonVariant = "primary"): string => {
  return styles[variant];
};

export const getSize = (size: ButtonSize = "md"): string => {
  return styles[size];
};

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      component,
      variant,
      size,
      type = "button",
      className,
      children,
      iconLeft,
      iconRight,
      iconOnly = false,
      disabled = false,
      isLoading = false,
      isSpinner = false,
      ...props
    },
    forwardedRef
  ) => {
    const Component = component || "button";

    return (
      <Component
        ref={forwardedRef}
        disabled={disabled || isLoading}
        type={type}
        className={classNames(
          styles.btn,
          getVariant(variant),
          getSize(size),
          { [`${styles.iconOnly}`]: iconOnly },
          className
        )}
        {...props}
      >
        {/* TODO: Icon only button */}

        {isSpinner && <Loading size="xs" />}
        {/* Icon Left */}
        {iconLeft && <Icon size={20} icon={iconLeft} />}

        {children && <span>{children}</span>}

        {/* Icon Right */}
        {iconRight && <Icon size={20} icon={iconRight} />}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
