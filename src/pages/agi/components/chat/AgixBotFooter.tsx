import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SendIcon from 'src/assets/images/sendIcon.svg?react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIButton } from 'src/components/UI/UIButton';
import chatConfig from 'src/configs/chat.config';
import { useImmutableCallback } from 'src/hooks/useActualRef';
import { useAgixBotState } from 'src/pages/agi/providers/AgixBotProvider';

export const AgixBotFooter = () => {
  const [{ userId, sending }, setChatState] = useAgixBotState();

  const [value, setValue] = useState('');

  const textArea = useRef<HTMLTextAreaElement>(null);
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    function messageHandler(event: MessageEvent) {
      if (event.data.type !== 'myTypeee') return;
      setValue(event.data.text);
    }

    window.addEventListener('message', messageHandler);
    return () => window.removeEventListener('message', messageHandler);
  }, []);

  useEffect(() => {
    const el = textArea.current;

    if (!el) return;

    textArea.current.addEventListener('input', inputCallback);

    textArea.current.addEventListener('keydown', keyDownCallback);
  }, [textArea]);

  const inputCallback = useImmutableCallback(() => {
    const el = textArea.current;

    if (!el) return;

    const numberOfSymbols = value.length;
    const symbolsPerRow = 100;
    el.rows = Math.min(5, Math.max(1, Math.ceil(numberOfSymbols / symbolsPerRow)));
  });

  const keyDownCallback = useImmutableCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (event.ctrlKey || event.shiftKey) {
        setValue(value + '\n');
      } else {
        event.preventDefault();
        sendUserMessage();
      }
    }
  });

  const sendUserMessage = async function () {
    if (sending) return;
    if (!value) return;

    const { apiUrl, userToken, scopeId } = chatConfig;

    setChatState((prevState) => ({ ...prevState, sending: true }));

    try {
      await axios.post(`${apiUrl}/handle_tasks`, {
        scope_id: scopeId,
        secret: userToken,
        user_id: userIdRef.current,
        user_message: value,
        channel: 'webchat',
        username: userIdRef.current,
        steps: [
          {
            field: 'answer',
            input_getter: 'getter_prompt',
            input_getter_kwargs: { prompt_var: 'ASSISTANT_PROMPT', agi: true },
            no_hallucinations: true,
          },
        ],
      });

      setChatState((prevState) => ({ ...prevState, sending: false, answering: true }));

      setValue('');

      const el = textArea.current;

      if (!el) return;

      el.rows = 1;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      }

      setChatState((prevState) => ({ ...prevState, sending: false, answering: false }));

      const el = textArea.current;

      if (!el) return;

      el.rows = 1;
    }
  };

  return (
    <OpacityBox className="p-2 mt-2 flex items-end gap-4 relative md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] mx-auto w-full">
      <textarea
        id="messageTextArea"
        placeholder="Message"
        className={`font-normal resize-none bg-transparent placeholder-gray-400 border border-gray-600 focus:border-purple-600 focus:ring-0 rounded-xl p-2 xl:px-3 xl:py-4 flex-1 ${sending ? 'opacity-20' : ''}`}
        rows={1}
        value={value}
        ref={textArea}
        disabled={sending}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <UIButton
        type="button"
        className={`p-2 xl:p-4 pr-2.5 xl:pr-4.5 rounded-xl flex-shrink-0 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ${sending ? 'opacity-20' : ''}`}
        onClick={sendUserMessage}
        processing={sending}
      >
        <SendIcon />
      </UIButton>
    </OpacityBox>
  );
};
