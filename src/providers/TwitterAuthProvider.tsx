import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { API_URL } from 'src/configs/api.config';
import { useAgixBotState } from 'src/pages/agi/providers/AgixBotProvider';
import { FCC } from 'src/types/FCC';

type TwitterResp =
  | {
      access_token: string;
      name: string;
      username: string;
    }
  | null
  | undefined;

type InitState = {
  auth: () => void;
  disconnect: (user_id: string) => void;
  twitterData: TwitterResp;
};

const initState: InitState = {
  auth: () => {},
  disconnect: () => {},
  twitterData: null,
};

const TwitterAuthProviderCtx = createContext(initState);

export const TwitterAuthProvider: FCC = ({ children }) => {
  const [twitterData, setTwitterData] = useState<TwitterResp>(initState.twitterData);
  const [{ userId }] = useAgixBotState();

  const { data } = useQuery({
    queryKey: ['twitter-auth', userId],
    queryFn: () =>
      axios
        .post(`${API_URL}/get_my_twitter`, { user_id: userId })
        .then((response) => response.data as TwitterResp),
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  const userAuthReq = useMutation({
    mutationFn: userAuth,
    onSuccess: (data) => {
      if (!data) return;

      const link = document.createElement('a');
      link.href = data;
      document.body.appendChild(link);
      link.click();
    },
  });

  const disconnect = useMutation({
    mutationFn: (user_id: string) => axios.post(`${API_URL}/disconnect_my_twitter`, { user_id }),
    onSuccess: () => {
      setTwitterData(null);
    },
  });

  useEffect(() => {
    setTwitterData(data);
  }, [data]);

  async function userAuth(data: { user_id: string }) {
    const resp = await axios.post(`${API_URL}/create_auth_twitter_auth_link`, data);
    return resp.data as string | undefined;
  }

  function handleUserAuth() {
    if (!userId) return;

    userAuthReq.mutate({ user_id: userId });
  }

  return (
    <TwitterAuthProviderCtx.Provider
      value={{
        auth: handleUserAuth,
        twitterData,
        disconnect: (user_id: string) => disconnect.mutate(user_id),
      }}
    >
      {children || <Outlet />}
    </TwitterAuthProviderCtx.Provider>
  );
};

export const useTwitterAuth = () => useContext(TwitterAuthProviderCtx);
