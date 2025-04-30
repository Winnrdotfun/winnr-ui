import classNames from 'classnames';
import { createElement, FC, PropsWithChildren, ReactNode, SVGProps } from 'react';

export type IconSize = 32 | 24 | 20 | 16 | 12 | 56;

export interface IconProps extends PropsWithChildren {
  className?: string | string[];
  icon?: FC<SVGProps<SVGElement>> | ReactNode;
  size: IconSize;
}

const Icon: FC<IconProps> = ({ icon, size, className, ...props }) => {
  if (icon instanceof Function) {
    return (
      <span
        className={classNames('flex items-center justify-center', className)}
        style={{ width: `${size}px`, height: `${size}px` }}
        {...props}>
        {createElement(icon, { width: size, height: size })}
      </span>
    );
  } else {
    return (
      <span
        className={classNames('flex items-center justify-center', className)}
        style={{ width: `${size}px`, height: `${size}px` }}
        {...props}>
        {icon}
      </span>
    );
  }
};

export default Icon;
