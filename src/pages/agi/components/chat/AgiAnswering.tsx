import { Icon } from '@iconify/react';

export const AgiAnswering = () => {
  return (
    <div className="message-container-agi items-start flex w-11/12 mb-2 text-left justify-start mr-auto">
      <div className="bg-white bg-opacity-30 backdrop-blur-3xl border border-white border-opacity-50 p-4 rounded-2xl mr-auto ml-4">
        <Icon className="animate-spin" icon="fa6-solid:spinner" />
      </div>
    </div>
  );
};
