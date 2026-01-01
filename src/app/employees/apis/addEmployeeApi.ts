import { CookieManager } from "@/lib/cookieManager";
import { InviteEmployeePayload } from "../schemas/addEmployee";

const requestBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function inviteEmployee(payload: InviteEmployeePayload): Promise<boolean>{
    const token = await CookieManager("get", "access-token");
    if (!token) {
        throw new Error("Authentication token not found");
    }

    const res = await fetch(`${requestBaseUrl}/business/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to invite employee");
      }

      return true;
}