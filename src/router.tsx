import React, { lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { PleaseSignInGuard } from 'src/components/PleaseSignInGuard';
import { ReferralWatcher } from 'src/components/ReferralWatcher';
import { MainLayout } from './layout/MainLayout';

const KnowledgeBaseId = lazy(() =>
  import('src/pages/my-bots/[botId]/[knowledgeBaseId]/knowledgeBaseId').then(
    ({ KnowledgeBaseId }) => ({ default: KnowledgeBaseId }),
  ),
);
const BotId = lazy(() =>
  import('src/pages/my-bots/[botId]/botId').then(({ BotId }) => ({ default: BotId })),
);
const MyBots = lazy(() =>
  import('src/pages/my-bots/my-bots').then(({ MyBots }) => ({ default: MyBots })),
);
const NewBot = lazy(() =>
  import('src/pages/my-bots/new-bot/new-bot').then(({ NewBot }) => ({ default: NewBot })),
);
const NotFound = lazy(() =>
  import('src/pages/not-found').then(({ NotFound }) => ({ default: NotFound })),
);
const BotsProvider = lazy(() =>
  import('src/providers/BotsProvider').then(({ BotsProvider }) => ({ default: BotsProvider })),
);

const BuildAgent = lazy(() =>
  import('src/pages/build-agent/build-agent').then(({ BuildAgent }) => ({
    default: BuildAgent,
  })),
);

const AiMarketplace = lazy(() =>
  import('src/pages/ai-marketplace/ai-marketplace').then(({ AiMarketplace }) => ({
    default: AiMarketplace,
  })),
);

const AGI = lazy(() =>
  import('src/pages/agi/agi').then(({ AGI }) => ({
    default: AGI,
  })),
);

const AIMarketplaceToolName = lazy(() =>
  import('src/pages/ai-marketplace/[toolName]/toolName').then(({ ToolName }) => ({
    default: ToolName,
  })),
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <>
        <ReferralWatcher />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/agi" replace />,
      },
      {
        path: 'my-bots',
        element: (
          <PleaseSignInGuard>
            <BotsProvider />
          </PleaseSignInGuard>
        ),
        children: [
          {
            index: true,
            element: <MyBots />,
          },
          {
            path: 'new-bot',
            element: <NewBot />,
          },
          {
            path: ':botId',
            children: [
              {
                index: true,
                element: <BotId />,
              },
              {
                path: ':knowledgeBaseId',
                element: <KnowledgeBaseId />,
              },
            ],
          },
        ],
      },
      {
        path: 'ai-marketplace',
        children: [
          {
            index: true,
            element: <AiMarketplace />,
          },
          {
            path: ':toolName',
            element: <AIMarketplaceToolName />,
          },
        ],
      },
      {
        path: 'agi',
        element: <AGI />,
      },
      {
        path: 'build-agent',
        element: <BuildAgent />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />, // A component to display when no routes match
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
