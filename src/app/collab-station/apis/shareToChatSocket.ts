import { socket } from "@/lib/socket";
import { CookieManager } from "@/lib/cookieManager";
import { ShareMessagePayload } from "../types";

export interface ShareSocketAck {
  success?: boolean;
  message?: unknown;
  error?: string | { message?: string; code?: string };
}

export async function ensureChatSocketConnected(): Promise<void> {
  const token = await CookieManager("get", "access-token");
  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
}

/**
 * Emits 'message:share' to the Collab Station chat gateway.
 * Strictly adheres to backend contract:
 * Payload: { groupId, entityType, entityId, text? }
 */
export async function emitShareMessage(
  payload: ShareMessagePayload
): Promise<{ success: boolean; messageId?: string }> {
  await ensureChatSocketConnected();

  return new Promise((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let settled = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      socket.off("message:error", handleErrorEvent);
    };

    const handleErrorEvent = (err: { message?: string; error?: string }) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(err?.message || err?.error || "Server rejected sharing item"));
    };

    socket.once("message:error", handleErrorEvent);

    timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      // If socket is connected and no error was sent, resolve optimistically
      if (socket.connected) {
        resolve({ success: true });
      } else {
        reject(new Error("Network timeout: unable to verify shared item"));
      }
    }, 6000);

    // Filter payload strictly to contract: groupId, entityType, entityId, text
    const cleanPayload: ShareMessagePayload = {
      groupId: payload.groupId,
      entityType: payload.entityType,
      entityId: payload.entityId,
    };
    if (payload.text && payload.text.trim()) {
      cleanPayload.text = payload.text.trim();
    }

    try {
      socket.emit("message:share", cleanPayload, (ack?: ShareSocketAck) => {
        if (settled) return;
        settled = true;
        cleanup();

        if (ack && ack.success === false) {
          const errText =
            typeof ack.error === "string"
              ? ack.error
              : ack.error?.message || "Server rejected sharing item to this group";
          reject(new Error(errText));
          return;
        }

        if (ack?.error) {
          const errText =
            typeof ack.error === "string"
              ? ack.error
              : ack.error.message || "Failed to share item";
          reject(new Error(errText));
          return;
        }

        const msgObj = ack?.message as { id?: string } | undefined;
        resolve({ success: true, messageId: msgObj?.id });
      });
    } catch (error) {
      if (!settled) {
        settled = true;
        cleanup();
        reject(error instanceof Error ? error : new Error("Failed to emit share message"));
      }
    }
  });
}
