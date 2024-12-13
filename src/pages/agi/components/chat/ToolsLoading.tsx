import { Icon } from '@iconify/react';
import { FC, useEffect, useState } from 'react';

const TT = [
  {
    name: 'Initializing the Model',
    status: 'waiting',
    loadedTxt: 'AI Agents connected: 0/33',
  },
  {
    name: 'Establishing Connection',
    status: 'waiting',
    loadedTxt: 'Synchronizing with AGI system',
  },
  {
    name: 'Building the Execution Plan',
    status: 'waiting',
    loadedTxt: 'Waiting',
  },
];

export const ToolsLoading: FC<{ setLoading: (val: boolean) => void }> = ({ setLoading }) => {
  const [tools, setTools] = useState(TT);

  useEffect(() => {
    let loadedCount = 0;
    let timeouts: NodeJS.Timeout[];

    const intervalId = setInterval(() => {
      setTools((prevTools) => {
        const increment = Math.floor(Math.random() * 10);
        loadedCount = Math.min(33, loadedCount + increment);
        const updatedTools = prevTools.map((tool, index) =>
          index === 0
            ? { ...tool, status: 'processing', loadedTxt: `AI Agents connected: ${loadedCount}/33` }
            : tool,
        );
        if (loadedCount > 33) {
          loadedCount = 33;
        }

        if (loadedCount === 33) {
          updatedTools[0].status = 'ready';
          timeouts = startTimeouts();
          clearInterval(intervalId);
        }
        return updatedTools;
      });
    }, 200); // Update every 500ms

    return () => {
      clearInterval(intervalId);
      timeouts?.forEach(clearTimeout);
    };
  }, []);

  function startTimeouts() {
    setTools((prevTools) =>
      prevTools.map((tool, index) =>
        index === 1 ? { ...tool, loadedTxt: 'Connecting', status: 'processing' } : tool,
      ),
    );

    return [
      setTimeout(() => {
        setTools((prevTools) =>
          prevTools.map((tool, index) =>
            index === 1 ? { ...tool, loadedTxt: 'Done', status: 'ready' } : tool,
          ),
        );
      }, 2000),
      setTimeout(() => {
        setTools((prevTools) =>
          prevTools.map((tool, index) => (index === 2 ? { ...tool, status: 'processing' } : tool)),
        );
      }, 2000),
      setTimeout(() => {
        setTools((prevTools) =>
          prevTools.map((tool, index) =>
            index === 2 ? { ...tool, status: 'ready', loadedTxt: 'Done' } : tool,
          ),
        );
      }, 4000),
      setTimeout(() => {
        setLoading(false);
      }, 5000),
    ];
  }

  return (
    <div className="z-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col">
      {tools.map((el) => (
        <div className="flex items-center [&:not(:last-child)]:mb-6">
          <div
            className={`flex items-center justify-center text-xl w-10 h-10 mr-2 rounded-xl bg-white ${el.status === 'ready' ? 'text-blue-400' : el.status === 'processing' ? 'bg-opacity-20' : 'bg-opacity-20 text-white text-opacity-10'}`}
          >
            <Icon
              className={el.status === 'processing' ? 'animate-spin' : ''}
              icon={
                el.status === 'ready'
                  ? 'fa6-solid:check'
                  : el.status === 'processing'
                    ? 'fa6-solid:spinner'
                    : 'fa6-solid:circle-notch'
              }
            />
          </div>
          <div className="text-left">
            <div className="text-xl">{el.name}</div>
            <div className="opacity-40">{el.loadedTxt}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
