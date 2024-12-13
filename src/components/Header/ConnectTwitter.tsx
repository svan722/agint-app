import { UIButton } from 'src/components/UI/UIButton';
import { useSetModal } from 'src/providers/ModalsProvider';
import { useTwitterAuth } from 'src/providers/TwitterAuthProvider';

export const ConnectTwitter = () => {
  const { auth, twitterData } = useTwitterAuth();
  const setModal = useSetModal();

  if (!twitterData) return <UIButton onClick={auth}>Connect Twitter</UIButton>;

  return (
    <UIButton onClick={() => setModal({ modalKey: 'twitter-modal' })}>
      @{twitterData.username}
    </UIButton>
  );
};
