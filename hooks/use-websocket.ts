"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

type WsStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseWebSocketOptions {
  scope?: string;
  enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { scope = "br", enabled = true } = options ?? {};
  const [status, setStatus] = useState<WsStatus>("disconnected");
  const [isUpdating, setIsUpdating] = useState(false);
  const socketRef = useRef<any>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(async () => {
    if (!enabled) return;

    const IS_MOCK = process.env.NEXT_PUBLIC_MOCK === "true";
    if (IS_MOCK) {
      // In mock mode, simulate WS connection
      setStatus("connected");
      return;
    }

    try {
      setStatus("connecting");
      const { io } = await import("socket.io-client");
      const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
      if (!WS_URL) {
        setStatus("disconnected");
        return;
      }
      const socket = io(WS_URL, {
        transports: ["websocket", "polling"],
        query: { scope },
      });

      socket.on("connect", () => {
        setStatus("connected");
      });

      socket.on("disconnect", () => {
        setStatus("disconnected");
      });

      socket.on("connect_error", () => {
        setStatus("error");
      });

      socket.on("RESULT_UPDATE", (data: any) => {
        setIsUpdating(true);
        // Invalidate relevant queries
        if (data?.scope === "br") {
          queryClient?.invalidateQueries?.({ queryKey: ["presidente"] });
        } else if (data?.scope?.length === 2) {
          queryClient?.invalidateQueries?.({ queryKey: ["governador", data.scope] });
          queryClient?.invalidateQueries?.({ queryKey: ["senador", data.scope] });
        } else {
          queryClient?.invalidateQueries?.({ queryKey: ["municipio", data?.scope] });
        }
        setTimeout(() => setIsUpdating(false), 1500);
      });

      socketRef.current = socket;
    } catch (err) {
      console.error("WebSocket connection error:", err);
      setStatus("error");
    }
  }, [enabled, scope, queryClient]);

  useEffect(() => {
    connect();
    return () => {
      socketRef?.current?.disconnect?.();
      socketRef.current = null;
    };
  }, [connect]);

  return { status, isUpdating };
}
