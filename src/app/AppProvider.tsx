"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { Notification } from "@/types/interfaces";
import { fetchNotification } from "@/utils/api";
import { fetchApiData } from "@/app/api/appService";
interface AppContextType {
  listNotification: Notification[];
  setListNotification: (noti: Notification[]) => void;
  showPlaylistMenu: boolean;
  setShowPlaylistMenu: (show: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  role: string | null;
  setRole: (role: string) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  socket: Socket | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a SongProvider");
  }
  return context;
};

export const AppProvider: React.FC<{
  children: ReactNode;
  initialAccessToken?: string;
  initialRole?: string;
  initialId?: string;
}> = ({ children, initialAccessToken = "", initialRole = "" }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listNotification, setListNotification] = useState<Notification[]>([])
  const [showPlaylistMenu, setShowPlaylistMenu] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [role, setRole] = useState<string>(() => {
    return typeof window !== "undefined"
      ? Cookies.get("role") || ""
      : initialRole;
  });

  const [accessToken, setAccessToken] = useState<string>(() => {
    return typeof window !== "undefined"
      ? Cookies.get("accessToken") || ""
      : initialAccessToken;
  });

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (accessToken && role) {
      Cookies.set("role", role, { expires: 7 });
      Cookies.set("accessToken", accessToken, { expires: 7 });
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("role");
    }
  }, [accessToken, role]);

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (accessToken) {
        try {
          const response = await fetchApiData(
            "/api/auth/refresh",
            "POST",
            JSON.stringify({ token: accessToken }),
            null,
            null
          );

          if (response.success) {
            const newAccessToken = response.data.accessToken;
            setAccessToken(newAccessToken);
          } else {
            Cookies.remove("accessToken");
            Cookies.remove("role")
          }
        } catch (error) {
          console.error("Error during token refresh:", error);
        }
      }
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      const fetchAPINotification = async (accessToken: string) => {
        const listFetchNotification = await fetchNotification(accessToken)
        setListNotification(listFetchNotification)
      }
      fetchAPINotification(accessToken)
      const newSocket = io(process.env.NEXT_PUBLIC_API_ENDPOINT, {
        auth: { accessToken: accessToken },
      });

      newSocket.on("errorToken", ({ code, message }) => {
        console.log("Error accesstoken code: ", code);
        console.log("Error accesstoken message: ", message);
        alert(message);
        newSocket.disconnect();
      });

      newSocket.on("errTokenMising", (data) => {
        alert(data);
      });

      newSocket.on("paymentStatus", (data) => {
        console.log("payment", data);
      });

      newSocket.on("newNoti", (data: Notification) => {
        setListNotification((prev) => [data, ...prev])

      })

      setSocket(newSocket);

      // Cleanup on Unmount or Token Change
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [accessToken]);

  const value = {
    listNotification,
    setListNotification,
    showPlaylistMenu,
    setShowPlaylistMenu,
    search,
    setSearch,
    loading,
    setLoading,
    role,
    setRole,
    accessToken,
    setAccessToken,
    socket,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
