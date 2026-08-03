import { CookieManager } from "@/lib/cookieManager";

const chatbotBaseUrl =
  process.env.NEXT_PUBLIC_BACKEND_CHATBOT_BASE_URL ||
  "http://localhost:8000";

const chatApiAuthKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  model: string;
  device: string;
  compute_type: string;
  diarized: boolean;
  filename: string;
  text: string;
  transcript: {
    text: string;
    language: string;
    language_probability: number;
    duration: number;
    segments: TranscriptSegment[];
  };
}

export async function transcribeAudioApi(
  file: File | Blob,
  filename?: string,
  language = "en",
  model = "small"
): Promise<TranscriptionResult> {
  const accessToken = (await CookieManager("get", "access-token")) as string | undefined;
  const formData = new FormData();

  const finalName =
    filename ||
    (file instanceof File ? file.name : "meeting.webm");

  formData.append("file", file, finalName);
  formData.append("language", language);
  formData.append("model", model);
  formData.append("diarize", "false");

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "1",
  };

  if (chatApiAuthKey) {
    headers["auth_key"] = chatApiAuthKey;
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const targetUrl = `${chatbotBaseUrl}/api/transcribe`;
  console.log(`[Transcription Request] Endpoint: ${targetUrl}`);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = `Transcription failed (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function transcribeUrlApi(
  url: string,
  filename?: string,
  language = "en",
  model = "small"
): Promise<TranscriptionResult> {
  const accessToken = (await CookieManager("get", "access-token")) as string | undefined;
  const formData = new FormData();

  formData.append("url", url);
  if (filename) formData.append("filename", filename);
  formData.append("language", language);
  formData.append("model", model);
  formData.append("diarize", "false");

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "1",
  };

  if (chatApiAuthKey) {
    headers["auth_key"] = chatApiAuthKey;
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const targetUrl = `${chatbotBaseUrl}/api/transcribe`;
  console.log(`[Transcription URL Request] Endpoint: ${targetUrl}, URL: ${url}`);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    let errorMessage = `Transcription failed (${response.status})`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
