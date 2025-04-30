import classNames from 'classnames';
import { FC } from 'react';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg';

const SizeClasses = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-6 h-6 border-4',
  md: 'w-12 h-12 border-4',
  lg: 'w-24 h-24 border-8',
};

export interface LoadingProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: LoadingSize;
}

export const getSize = (size: LoadingSize = 'md'): string => {
  return SizeClasses[size];
};

const Loading: FC<LoadingProps> = ({ size = 'md', className }) => {
  return (
    <span
      className={classNames(
        `border-gray-100 border-b-indigo-500 rounded-full inline-block animate-spin`,
        getSize(size),
        className
      )}
    />
  );
};

export default Loading;
