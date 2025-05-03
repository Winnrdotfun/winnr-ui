import React, { FC } from 'react';

import Button from '@ui/Button/Button';

import { useModals } from './use-modals/use-modals';

import { ConfirmModalProps } from './ConfirmModal';

export const FormModal: FC<ConfirmModalProps> = ({
  id,
  title,
  cancelProps,
  confirmProps,
  labels = { cancel: '', confirm: '' },
  closeOnConfirm = true,
  closeOnCancel = true,
  onCancel,
  onConfirm,
  children,
  isLoading = false,
}) => {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;
  const ctx = useModals();

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof cancelProps?.onClick === 'function' && cancelProps?.onClick(event);
    typeof onCancel === 'function' && onCancel();
    closeOnCancel && ctx.closeModal(id);
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof confirmProps?.onClick === 'function' && confirmProps?.onClick(event);
    typeof onConfirm === 'function' && onConfirm();
    closeOnConfirm && ctx.closeModal(id);
  };

  return (
    <div className='bg-white rounded-lg'>
      <h3
        className='text-left px-5 py-4 text-base font-bold text-gray-900 border-b border-gray-50'
        id='modal-title'>
        {title}
      </h3>
      <div className='px-5 py-6 bg-gray-0'>{children}</div>
      <div className='space-x-2 px-5 py-4 flex justify-end border-t border-gray-50'>
        <Button variant='secondary' {...cancelProps} onClick={handleCancel}>
          {cancelProps?.children || cancelLabel}
        </Button>
        <Button {...confirmProps} onClick={handleConfirm} isLoading={isLoading} autoFocus>
          {confirmProps?.children || confirmLabel}
        </Button>
      </div>
    </div>
  );
};
