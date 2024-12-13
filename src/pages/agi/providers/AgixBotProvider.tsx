import { createContext, Dispatch, useContext, useEffect, useState } from 'react';
import { FCC } from 'src/types/FCC';
import { v4 as uuidv4 } from 'uuid';

type ChatSettingsState = {
  userId: string | null;
  answering: boolean;
  sending: boolean;
  lsKey: string | null;
};

const ChatSettingsProviderInitCtx: ChatSettingsState = {
  userId: null,
  answering: false,
  sending: false,
  lsKey: null,
};

const AgixBotSettingsProviderCtx = createContext<
  [ChatSettingsState, Dispatch<React.SetStateAction<ChatSettingsState>>]
>([ChatSettingsProviderInitCtx, () => null]);

const LSIDKey = 'agix-bot-user-id';

export const AgixBotProvider: FCC<{ lsKey: string }> = ({ children, lsKey }) => {
  const [state, setState] = useState<ChatSettingsState>({ ...ChatSettingsProviderInitCtx, lsKey });

  useEffect(() => {
    let userId = localStorage.getItem(LSIDKey);

    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(LSIDKey, userId);
    }

    setState((prevState) => ({ ...prevState, userId }));
  }, []);

  return (
    <AgixBotSettingsProviderCtx.Provider value={[state, setState]}>
      {children}
    </AgixBotSettingsProviderCtx.Provider>
  );
};

export const useAgixBotState = () => useContext(AgixBotSettingsProviderCtx);
