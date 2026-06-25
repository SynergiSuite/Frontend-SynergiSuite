import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL!;

export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false, // important (we control connection manually)
});