import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { queryClient } from '@/lib/query-client';

interface NetworkContextValue {
  isConnected: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({ isConnected: true });

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;
      setIsConnected((prev) => {
        if (!prev && connected) {
          queryClient.invalidateQueries();
        }
        return connected;
      });
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  return useContext(NetworkContext);
};
