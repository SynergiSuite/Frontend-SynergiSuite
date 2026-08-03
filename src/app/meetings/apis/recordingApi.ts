import { CookieManager } from "@/lib/cookieManager";
import { MeetingRecording } from "../types/recordingTypes";
import { transcribeUrlApi, TranscriptionResult } from "./transcribeApi";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://feline-unloaded-virtual.ngrok-free.dev";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await CookieManager("get", "access-token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
    "ngrok-skip-browser-warning": "1",
  };
}

export interface SavedTranscriptResponse {
  transcriptAvailable?: boolean;
  alreadyExists?: boolean;
  transcript?: string;
  text?: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  provider?: string;
}

export async function getRecording(roomName: string): Promise<MeetingRecording | null> {
  if (!roomName) return null;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/recordings/${encodeURIComponent(roomName)}`, {
      method: "GET",
      headers,
    });

    if (response.status === 404) {
      // Recording not started or metadata record not yet created by webhook
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[Recording Metadata Failed] GET /api/recordings/${roomName} returned status ${response.status}:`, errorText);
      return null;
    }

    const data: MeetingRecording = await response.json();
    return data;
  } catch (error) {
    console.error(`[Recording Metadata Failed] Network or parse error for room "${roomName}":`, error);
    return null;
  }
}

export async function stopRecording(roomName: string): Promise<MeetingRecording> {
  if (!roomName) throw new Error("Room name is required to stop recording");
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/recordings/${encodeURIComponent(roomName)}/stop`, {
      method: "POST",
      headers,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const message = errorJson.message || `Stop recording request failed (${response.status})`;
      if (response.status === 403) {
        throw new Error("Only the meeting host can stop recording");
      }
      throw new Error(message);
    }

    const data: MeetingRecording = await response.json();
    return data;
  } catch (error: any) {
    console.error(`[Recording Stop Failed] POST /api/recordings/${roomName}/stop error:`, error);
    throw error;
  }
}

export async function getRecordingPlaybackUrl(roomName: string): Promise<string> {
  if (!roomName) throw new Error("Room name is required to fetch playback URL");
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/recordings/${encodeURIComponent(roomName)}/playback-url`, {
      method: "GET",
      headers,
    });

    if (response.status === 404) {
      throw new Error("Recording is still processing");
    }

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const message = errorJson.message || `Playback URL request failed (${response.status})`;
      throw new Error(message);
    }

    const data: any = await response.json();
    const url = data.playbackUrl || data.viewUrl;
    if (!url) {
      throw new Error("Playback URL not returned by server");
    }
    return url;
  } catch (error: any) {
    console.error(`[Recording Playback URL Failed] GET /api/recordings/${roomName}/playback-url error:`, error);
    throw error;
  }
}

export async function waitForRecordingPlaybackUrl(
  roomName: string,
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<string> {
  if (!roomName) throw new Error("Room name is required to fetch playback URL");

  const intervalMs = options.intervalMs ?? 5000;
  const timeoutMs = options.timeoutMs ?? 120000;
  const startedAt = Date.now();
  let lastRecording: MeetingRecording | null = null;

  while (Date.now() - startedAt <= timeoutMs) {
    const recording = await getRecording(roomName);
    if (recording) {
      lastRecording = recording;

      if (recording.status === "complete") {
        if (recording.playbackUrl) {
          return recording.playbackUrl;
        }
        if (recording.filePath || recording.fileLocation) {
          return getRecordingPlaybackUrl(roomName);
        }
      }

      if (recording.status === "failed" || recording.status === "aborted" || recording.status === "limit_reached") {
        throw new Error(recording.error || `Recording ended with status: ${recording.status}`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  const statusText = lastRecording?.status ? ` Current status: ${lastRecording.status}.` : "";
  throw new Error(`Recording upload is still processing.${statusText}`);
}

export async function getSavedTranscript(roomName: string): Promise<SavedTranscriptResponse | null> {
  if (!roomName) return null;
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/recordings/${encodeURIComponent(roomName)}/transcript`, {
      method: "GET",
      headers,
    });

    if (response.status === 404) {
      return { transcriptAvailable: false };
    }

    if (!response.ok) {
      console.warn(`[Saved Transcript GET] Status ${response.status} for room "${roomName}"`);
      return { transcriptAvailable: false };
    }

    const data: SavedTranscriptResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`[Saved Transcript GET Error] Room "${roomName}":`, error);
    return { transcriptAvailable: false };
  }
}

export async function saveTranscript(
  roomName: string,
  payload: {
    transcript: string;
    segments?: Array<{ start: number; end: number; text: string }>;
    language?: string;
    provider?: string;
  }
): Promise<SavedTranscriptResponse> {
  if (!roomName) throw new Error("Room name is required to save transcript");
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${baseUrl}/api/recordings/${encodeURIComponent(roomName)}/transcript`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        transcript: payload.transcript,
        segments: payload.segments || [],
        language: payload.language || "en",
        provider: payload.provider || "openai",
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.message || `Save transcript failed (${response.status})`);
    }

    const data: SavedTranscriptResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error(`[Saved Transcript POST Error] Room "${roomName}":`, error);
    throw error;
  }
}

export async function getOrGenerateMeetingTranscript(
  roomName: string,
  playbackUrl?: string,
  filename?: string
): Promise<TranscriptionResult> {
  // 1. Check NestJS DB first: GET /api/recordings/:roomName/transcript
  const saved = await getSavedTranscript(roomName);

  if (saved && (saved.transcriptAvailable || saved.transcript || saved.text)) {
    const textContent = saved.transcript || saved.text || "";
    console.log(`[Transcript Flow] Loaded existing transcript from DB for room "${roomName}"`);

    return {
      model: saved.provider || "saved-db",
      device: "server",
      compute_type: "db",
      diarized: false,
      filename: filename || `${roomName}.mp4`,
      text: textContent,
      transcript: {
        text: textContent,
        language: saved.language || "en",
        language_probability: 1.0,
        duration: 0,
        segments: (saved.segments || []).map((s: any) => ({
          start: Number(s.start || 0),
          end: Number(s.end || 0),
          text: String(s.text || ""),
        })),
      },
    };
  }

  // 2. Not in DB -> Obtain playback URL if missing
  let finalUrl = playbackUrl;
  if (!finalUrl) {
    finalUrl = await getRecordingPlaybackUrl(roomName);
  }

  if (!finalUrl) {
    throw new Error("Recording URL is not available to transcribe.");
  }

  // 3. Generate transcript once via speech-to-text AI
  console.log(`[Transcript Flow] Generating new transcript via speech-to-text AI for room "${roomName}"...`);
  const result = await transcribeUrlApi(finalUrl, filename);

  // 4. Save generated transcript to NestJS DB: POST /api/recordings/:roomName/transcript
  try {
    const fullText = result.text || result.transcript?.text || "";
    const segmentsPayload = (result.transcript?.segments || []).map((s) => ({
      start: s.start,
      end: s.end,
      text: s.text,
    }));

    const saveRes = await saveTranscript(roomName, {
      transcript: fullText,
      segments: segmentsPayload,
      language: result.transcript?.language || "en",
      provider: "openai",
    });

    if (saveRes.alreadyExists) {
      console.log(`[Transcript Flow] Transcript was already saved by another client for room "${roomName}"`);
    } else {
      console.log(`[Transcript Flow] Transcript saved successfully to DB for room "${roomName}"`);
    }
  } catch (saveErr) {
    console.warn(`[Transcript Flow] Failed to save generated transcript to DB:`, saveErr);
  }

  return result;
}
