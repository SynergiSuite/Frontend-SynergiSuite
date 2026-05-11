const chatApiAuthKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export function getChatApiHeaders() {
  if (!chatApiAuthKey) {
    throw new Error("Chat API auth key is missing from the environment");
  }

  return {
    "Content-Type": "application/json",
    auth_key: chatApiAuthKey,
  };
}
