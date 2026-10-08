import { NextResponse } from "next/server";

type ProxyBackendOptions = {
  backendPath: string;
  forwardAuthorization?: boolean;
  method?: "DELETE" | "GET" | "PATCH" | "POST";
};

export async function proxyBackendRequest(
  request: Request,
  {
    backendPath,
    forwardAuthorization = false,
    method = "POST",
  }: ProxyBackendOptions,
) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!backendBaseUrl || !clientSecret) {
    return NextResponse.json(
      { message: "Backend service is not configured." },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");
  const headers = new Headers({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "x-client-secret": clientSecret,
  });

  if (forwardAuthorization && authorization) {
    headers.set("Authorization", authorization);
  }

  try {
    const body = method === "GET" || method === "DELETE" ? undefined : await request.text();
    const response = await fetch(
      `${backendBaseUrl.replace(/\/$/, "")}${backendPath}`,
      {
        method,
        headers,
        body: body || undefined,
        cache: "no-store",
      },
    );
    const responseBody = await response.text();

    return new NextResponse(responseBody || null, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach the backend service." },
      { status: 502 },
    );
  }
}
