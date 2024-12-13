import { Icon } from '@iconify/react';
// @ts-ignore
import markdownItClass from '@toycode/markdown-it-class';
// @ts-ignore
import markdownIt from 'markdown-it';
// @ts-ignore
import markdownItLinkAttributes from 'markdown-it-link-attributes';
// @ts-ignore
import markdownItSanitizer from 'markdown-it-sanitizer';
// @ts-ignore
import markdownItSup from 'markdown-it-sup';
import { memo } from 'react';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { Message } from 'src/types/conversation';

export const AgiChatMessageItem = memo<{ message: Message }>(function AgiChatMessageItem({
  message,
}) {
  const isAI = message.user_id === 'ai' || !message.user_id;

  const sanitizeHTML = (content: string) =>
    markdownIt({ break: true })
      .use(markdownItClass, {
        img: ['rcw-message-img'],
      })
      .use(markdownItSup)
      .use(markdownItSanitizer)
      .use(markdownItLinkAttributes, { attrs: { target: '_blank', rel: 'noopener' } })
      .render(content);

  async function handleCopy(content: string) {
    const tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = sanitizeHTML(content);
    const txt = tempDivElement.textContent || tempDivElement.innerText || '';

    await navigator.clipboard.writeText(txt);

    toast.success('Message coped');
  }

  const steps = message.metadata.result?.answer_appendix?.steps || message.metadata.steps;
  const plan = message.metadata.plan;

  return (
    <div
      className={`message-container-agi items-start flex w-11/12 mb-2 text-left ${
        isAI ? 'justify-start mr-auto' : 'justify-end flex-row-reverse ml-auto'
      }`}
    >
      <div
        className={`relative bg-opacity-10 backdrop-blur-3xl border border-white border-opacity-50  py-2 px-4 rounded-2xl ${
          isAI ? 'mr-auto ml-4 bg-white pr-6  xl:pr-10' : 'ml-auto mr-2 bg-transparent'
        }`}
      >
        <div
          style={{ overflowWrap: 'anywhere' }}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(message.content) }}
        ></div>
        {isAI && plan && (
          <div className="opacity-40">
            <h4>What AI is planing to do:</h4>
            <div
              style={{ overflowWrap: 'anywhere' }}
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(plan) }}
            ></div>
          </div>
        )}
        {isAI && steps && steps.length !== 0 && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              {steps.map((step, i) => (
                <>
                  <button
                    id={`item_${i}`}
                    className="flex flex-shrink-0 items-center gap-1 p-2 bg-white bg-opacity-20 rounded-xl"
                  >
                    {step.title}
                    {!step.output && (
                      <Icon className="animate-spin-slow ml-2 -mt-0.5" icon="fa6-solid:spinner" />
                    )}
                  </button>
                  {i !== steps.length - 1 && <Icon icon="fa6-solid:caret-right" />}
                  {step.output && (
                    <Tooltip
                      openOnClick
                      className="!opacity-100 !h-80"
                      style={{
                        color: '#000',
                        backgroundColor: 'white',
                        width: '700px',
                        maxHeight: '250px !important',
                        borderRadius: '14px',
                        zIndex: 10,
                      }}
                      anchorSelect={`#item_${i}`}
                      clickable
                    >
                      <div className="flex gap-4 h-full">
                        <div className="overflow-hidden flex flex-col w-1/2">
                          <div className="flex justify-between mb-1">
                            <span>Input</span>
                            <button onClick={() => handleCopy(step.input)} className="opacity-20">
                              <Icon icon="fa6-solid:clone" />
                            </button>
                          </div>
                          <div className="break-all border border-[#17191B] border-opacity-20 rounded-xl p-2 overflow-auto flex-grow">
                            <div
                              style={{ overflowWrap: 'anywhere' }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.input) }}
                            ></div>
                          </div>
                        </div>
                        <div className="overflow-hidden flex flex-col w-1/2">
                          <div className="flex justify-between mb-1">
                            <span>Output</span>
                            <button onClick={() => handleCopy(step.output)} className="opacity-20">
                              <Icon icon="fa6-solid:clone" />
                            </button>
                          </div>
                          <div className="break-all border border-[#17191B] border-opacity-20 rounded-xl p-2 overflow-auto flex-grow">
                            <div
                              style={{ overflowWrap: 'anywhere' }}
                              dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.output) }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Tooltip>
                  )}
                </>
              ))}
            </div>
          </>
        )}
        {isAI && message.content && (
          <div className="absolute flex items-center gap-2 top-2 right-2 opacity-40">
            <button onClick={() => handleCopy(message.content)}>
              <Icon icon="fa6-solid:copy" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
