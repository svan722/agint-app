import { FC } from 'react';
import { Modal } from 'src/components/UI/Modal';
import { UIButton } from 'src/components/UI/UIButton';
import { useAgixBotState } from 'src/pages/agi/providers/AgixBotProvider';
import { useSetModal } from 'src/providers/ModalsProvider';
import { useTwitterAuth } from 'src/providers/TwitterAuthProvider';
import { TwitterInfoModalSettings } from 'src/types/modal';

export const TwitterInfoModal: FC<TwitterInfoModalSettings> = () => {
  const { twitterData, disconnect } = useTwitterAuth();
  const [{ userId }] = useAgixBotState();
  const setModal = useSetModal();

  function handleDisconnect() {
    if (!userId) return;
    
    disconnect(userId);
    setModal(null);
  }

  return (
    <Modal>
      <div className="modal-title">Your connected twitter account data</div>
      <div className="flex items-center gap-6">
        <span className="opacity-40">Username:</span> <span>{twitterData?.username}</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="opacity-40">Name:</span> <span>{twitterData?.name}</span>
      </div>
      <div className="flex items-center justify-center gap-4">
        <UIButton buttonColor="blur-white" onClick={handleDisconnect}>
          Disconnect
        </UIButton>
        <UIButton onClick={() => setModal(null)}>Close</UIButton>
      </div>
    </Modal>
  );
};
