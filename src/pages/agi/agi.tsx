import { useState } from 'react';
import { OpacityBox } from 'src/components/UI/OpacityBox';
import { UIButton } from 'src/components/UI/UIButton';
import { AgixBotContent } from 'src/pages/agi/components/chat/AgixBotContent';
import { AgixBotFooter } from 'src/pages/agi/components/chat/AgixBotFooter';
import { ToolsLoading } from 'src/pages/agi/components/chat/ToolsLoading';

export const AGI = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [loadingTools, setLoadingTools] = useState(true);

  if (showBanner)
    return (
      <div className="container mx-auto flex-grow">
        <OpacityBox
          style={{
            backgroundImage: "url('/images/ai-marketplace/top-banner.png')",
          }}
          className="relative pt-[33%] xl:min-h-[400px] overflow-hidden bg-right bg-no-repeat mt-10 mb-5 border border-white border-opacity-10 bg-[length:auto_100%]"
        >
          <div className="flex flex-col items-start p-8 xl:p-12 2xl:p-16 h-full max-w-[400px] w-full absolute top-0 left-0">
            <h2 className="text-2xl xl:text-3xl 2xl:text-[40px] leading-none mb-8">
              Artificial
              <br />
              General
              <br />
              Intelligence
            </h2>
            <p className="opacity-40 font-normal">
              The ultimate AI command center,
              <br />
              coordinating external and internal AI
              <br />
              agents to handle complex queries.
            </p>
            <UIButton
              className="mt-auto"
              size="xl"
              buttonColor="blue"
              onClick={() => setShowBanner(false)}
            >
              Launch
            </UIButton>
          </div>
        </OpacityBox>
      </div>
    );

  return (
    <div className="container mx-auto flex-grow h-full flex flex-col">
      <OpacityBox className="relative aura wrapper flex-grow !p-4 overflow-hidden border border-white border-opacity-20 bg-[length:auto_100%]">
        <div className="flex flex-col w-full h-full overflow-hidden">
          {loadingTools ? <ToolsLoading setLoading={setLoadingTools} /> : <AgixBotContent />}
        </div>
      </OpacityBox>
      <AgixBotFooter />
    </div>
  );
};
