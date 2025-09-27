import { setCookie, deleteCookie, getCookie } from "cookies-next";

type CookieAction = "set" | "delete" | "get";

export const CookieManager = (
  action: CookieAction,
  key: string,
  value?: string | number,
) => {
  switch (action) {
    case "set":
      if (!value) throw new Error("Value is required to set a cookie");
      setCookie(key, value, {
        path: "/",
        maxAge: 60 * 60 * 24 * 1,
      });
      break;
    case "delete":
      deleteCookie(key, { path: "/" });
      break;
    case "get":
      return getCookie(key);
  }
};
