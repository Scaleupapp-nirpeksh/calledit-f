import { io, type Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "./events";
import { getAccessToken } from "@/lib/utils/storage";

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

/**
 * Get or create the singleton Socket.IO connection.
 * Authenticates with the current access token.
 */
export function getSocket(): AppSocket {
  if (socket?.connected) return socket;

  const token = getAccessToken();
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8000";

  socket = io(wsUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  }) as AppSocket;

  return socket;
}

/**
 * Disconnect and destroy the singleton socket.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Update auth token on the existing socket (e.g. after token refresh).
 */
export function updateSocketAuth(): void {
  if (!socket) return;
  const token = getAccessToken();
  socket.auth = { token };
}
