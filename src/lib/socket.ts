import { io } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
  "https://feline-unloaded-virtual.ngrok-free.dev";

// The collab gateway is registered under Nest's `/chat` Socket.IO namespace.
// Using polling + websocket allows initial HTTP handshake through ngrok before upgrading seamlessly.
export const socket = io(`${URL}/chat`, {
  transports: ["polling", "websocket"],
  extraHeaders: {
    "ngrok-skip-browser-warning": "1",
  },
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1500,
  reconnectionDelayMax: 5000,
});
