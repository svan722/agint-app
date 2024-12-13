import { Icon } from '@iconify/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { CustomScroll } from 'react-custom-scroll';
import { LoadingStub } from 'src/components/UI/LoadingStub';
import { UIAlert } from 'src/components/UI/UIAlert';
import { UIButton } from 'src/components/UI/UIButton';
import chatConfig from 'src/configs/chat.config';
import { AgiAnswering } from 'src/pages/agi/components/chat/AgiAnswering';
import { AgiChatMessageItem } from 'src/pages/agi/components/chat/AgiChatMessageItem';
import { useAgixBotState } from 'src/pages/agi/providers/AgixBotProvider';
import { History, Message, NewMessage } from 'src/types/conversation';
import { useSwapTx } from '../../hooks/useSwapTx';
// Информация о токенах
const tokens = {
  FET: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
  AGIX: '0x5b7533812759b45c2b44c19e320ba2cd2681b542',
  GRT: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
};

const FAST_MENU = [
  {
    icon: '/images/welcom-item-icon-1.png',
    text: 'Perform a detailed due diligence review of this project',
  },
  {
    icon: '/images/welcom-item-icon-2.png',
    text: "Create and publish a post about AGIX's AGI for my X (Twitter) page",
  },
  {
    icon: '/images/welcom-item-icon-3.png',
    text: 'Send me real-time news alerts that could impact ETH price movements',
  },
  {
    icon: '/images/welcom-item-icon-4.png',
    text: "Monitor and report transactions and balances for Buterin's Ethereum wallet",
  },
  {
    icon: '/images/welcom-item-icon-5.png',
    text: 'Evaluate the current ETH price resistance levels and provide trading insights',
  },
  {
    icon: '/images/welcom-item-icon-6.png',
    text: 'Gather and summarize key market data about the AI Agents industry, including sources',
  },
  {
    icon: '/images/welcom-item-icon-7.png',
    text: 'Analyze the followers and followings of the X (Twitter) profile',
  },
  {
    icon: '/images/welcom-item-icon-8.png',
    text: 'Compare the AGIX project with competitors like Fetch.AI, Singularity, and others',
  },
  {
    icon: '/images/welcom-item-icon-9.png',
    text: 'Break down the BTC whitepaper into key points I can explain simply to my friends',
  },
];

export const AgixBotContent = () => {
  const [{ userId, answering }, setSwapBotState] = useAgixBotState();
  const { isConnected } = useWeb3ModalAccount();

  const lastMessageId = useRef<number>(0);
  const lastMessagePartial = useRef<boolean>(false);
  const container = useRef<HTMLDivElement>(null);
  const [showSwapButtons, setShowSwapButtons] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: history,
    isPending,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['chatHistory', userId],
    queryFn: () => getChatHistory(),
    refetchOnWindowFocus: false,
  });

  const getChatHistory: () => Promise<Message[]> = async () => {
    if (!userId) return Promise.resolve([] as Message[]);

    const { apiUrl } = chatConfig;

    const resp = await axios.post<History>(`${apiUrl}/conversation_history`, {
      user_id: userId,
    });

    const conversation = resp.data.conversation;

    if (conversation.length === 0) {
      lastMessageId.current = 0;
      waitForNewMessage();
      return [] as Message[];
    }

    const parts = conversation[conversation.length - 1].msg_id.split('-');

    lastMessageId.current = parseInt(parts[parts.length - 1]);
    waitForNewMessage();

    return conversation;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!container.current) return;
      container.current.scrollTop = container.current.scrollHeight;
    }, 200);

    return () => clearTimeout(timeout);
  }, [history]);

  const waitForNewMessage = () => {
    const { apiUrl } = chatConfig;

    try {
      axios
        .get<NewMessage>(`${apiUrl}/wait_for_new_message/${userId}/${lastMessageId.current}`)
        .then((resp) => {
          if (resp.data.status !== 'ok') {
            console.log('Integratly: No new messages');
            setTimeout(() => waitForNewMessage(), 2000);
            return;
          }

          const message = resp.data.message;
          console.log('Integratly: listenForMessages message === >', message);
          const idParts = message.msg_id.split('-');
          const newMessageId = parseInt(idParts[idParts.length - 1]);

          if (message.metadata.partial) {
            queryClient.setQueryData(['chatHistory', userId], (oldData: Message[]) => {
              if (lastMessagePartial.current)
                return [...oldData.slice(0, oldData.length - 1), message];

              return [...oldData, message];
            });

            lastMessagePartial.current = true;

            setTimeout(() => waitForNewMessage(), 2000);
            return;
          }

          if (newMessageId > lastMessageId.current) {
            lastMessageId.current = newMessageId;

            if (resp.data.status === 'ok') {
              queryClient.setQueryData(['chatHistory', userId], (oldData: Message[]) => {
                if (lastMessagePartial.current) {
                  lastMessagePartial.current = false;
                  return [...oldData.slice(0, oldData.length - 1), message];
                }

                return [...oldData, message];
              });

              if (message.user_id === 'ai')
                setSwapBotState((prevState) => ({ ...prevState, answering: false }));

              setTimeout(() => {
                waitForNewMessage();
                // setShowSwapButtons(true);
              }, 200);
            }
          }
        })
        .catch((e) => {
          console.log('Error restart waitForNewMessage in 2 sec');
          console.error(e);
          setTimeout(() => waitForNewMessage(), 2000);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSwap = useSwapTx();

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault();
        setShowSwapButtons((prevState) => !prevState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleSendMessage(text: string) {
    window.postMessage({ text, type: 'myTypeee' });
  }

  return (
    <div className="w-full h-full overflow-hidden pt-2 text-sm">
      <CustomScroll className="flex flex-col h-full" keepAtBottom heightRelativeToParent="100%">
        {isPending ? (
          <LoadingStub className="h-full" label="Loading conversation history..." />
        ) : historyError ? (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2">
            <UIAlert type="error" message="Error while loading history" />
            <UIButton
              onClick={() => refetchHistory()}
              buttonColor="blur-white"
              startIcon={<Icon icon="material-symbols:refresh" className="-mr-2 text-lg" />}
            >
              Retry
            </UIButton>
          </div>
        ) : history.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-w-[1200px] mx-auto px-8">
              {FAST_MENU.map((el) => (
                <div
                  className="flex items-center gap-3 hover:scale-105 cursor-pointer"
                  onClick={() => handleSendMessage(el.text)}
                >
                  <img className="w-16" src={el.icon} />
                  <p className="font-semibold opacity-60 text-left">{el.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          history.map((message, i) => (
            <AgiChatMessageItem key={message.msg_id + i} message={message} />
          ))
        )}
        {showSwapButtons && !isPending && (
          <div
            className={
              'message-container-agi items-start flex w-11/12 mb-2 text-left justify-start mr-auto gap-2.5 ml-4'
            }
          >
            <UIButton
              onClick={() => handleSwap(tokens.AGIX, 'AGIX')}
              buttonColor="blur-blue"
              disabled={!isConnected}
            >
              Swap AGIX
            </UIButton>
            <UIButton
              onClick={() => handleSwap(tokens.FET, 'FET')}
              buttonColor="blur-blue"
              disabled={!isConnected}
            >
              Swap FET
            </UIButton>
            <UIButton
              onClick={() => handleSwap(tokens.GRT, 'GRT')}
              buttonColor="blur-blue"
              disabled={!isConnected}
            >
              Swap GRT
            </UIButton>
          </div>
        )}
        {answering && <AgiAnswering />}
      </CustomScroll>
    </div>
  );
};
