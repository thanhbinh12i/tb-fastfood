"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RefreshToken from "./refresh-token";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { removeTokensFromLocalStorage } from "@/lib/utils";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsAuth: (isAuth: boolean) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuthState] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthState(true);
    }
  }, []);

  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true);
    } else {
      removeTokensFromLocalStorage();
      setIsAuthState(false);
    }
  }, []);
  return (
    // Provide the client to your App
    <AppContext.Provider value={{ isAuth, setIsAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
