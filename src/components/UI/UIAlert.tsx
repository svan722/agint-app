import { Icon } from '@iconify/react';
import { FC } from 'react';

const colorClass = {
  info: {
    bgColor: 'bg-inherit',
    textColor: 'text-inherit',
  },
  success: {
    bgColor: 'bg-[#52C41A]',
    textColor: 'text-[#52C41A]',
  },
  error: {
    bgColor: 'bg-[#ED1522]',
    textColor: 'text-[#ED1522]',
  },
  warning: {
    bgColor: 'bg-[#FFE662]',
    textColor: 'text-[#FFE662]',
  },
} as const;

export const UIAlert: FC<{
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}> = ({ message, type }) => {
  const { bgColor, textColor } = colorClass[type];

  return (
    <div
      className={`rounded-xl flex gap-4 items-center bg-opacity-20 px-6 py-3 text-xl ${bgColor}`}
    >
      <Icon icon="fa6-solid:circle-check" className={textColor} />
      <span>{message}</span>
    </div>
  );
};
