import { CookieManager } from "@/lib/cookieManager";

export const getAccessToken = (): string | undefined => CookieManager("get", "access-token") as string | undefined;
export const authHeaders = (token?: string) => ({ Authorization: `Bearer ${token ?? ""}` });
export const isAbsoluteUrl = (value?: string) => Boolean(value && /^https?:\/\//i.test(value));
export const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export type UserId = number | string;
export type TokenUser = { user_id?: UserId; sub?: UserId; email?: string };

export const readTokenUser = (token: string): TokenUser => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
};