import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL!;

// The collab gateway is registered under Nest's `/chat` Socket.IO namespace.
export const socket = io(`${URL}/chat`, {
  transports: ["websocket"],
  autoConnect: false,
});
