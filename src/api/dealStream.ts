import type { DealPatch, DealRecord, StreamState } from "../domain/deals";

type StreamHandlers = {
  onPatch: (patch: DealPatch) => void;
  onState: (state: StreamState) => void;
  onError?: (error: Error) => void;
};

export type StreamController = {
  close: () => void;
};

const snapshotPath = import.meta.env.VITE_SNAPSHOT_PATH ?? "/api/deals";
const streamPath = import.meta.env.VITE_STREAM_PATH ?? "/api/deals/stream";

export async function fetchDealSnapshot(signal?: AbortSignal): Promise<DealRecord[]> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return [];
  }

  const response = await fetch(joinUrl(baseUrl, snapshotPath), {
    headers: buildHeaders(),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Snapshot request failed with ${response.status}`);
  }

  return response.json() as Promise<DealRecord[]>;
}

export function openDealStream(handlers: StreamHandlers): StreamController {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    handlers.onState("replaying");
    return { close: () => undefined };
  }

  const controller = new AbortController();
  handlers.onState("connecting");

  void streamWithFetch(joinUrl(baseUrl, streamPath), controller.signal, handlers);

  return {
    close: () => controller.abort(),
  };
}

export function parseStreamFrame(frame: string): DealPatch | null {
  const trimmed = frame.trim();

  if (!trimmed || trimmed.startsWith(":")) {
    return null;
  }

  if (trimmed.startsWith("data:")) {
    const payload = trimmed
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.replace(/^data:\s?/, ""))
      .join("");

    return JSON.parse(payload) as DealPatch;
  }

  return JSON.parse(trimmed) as DealPatch;
}

async function streamWithFetch(url: string, signal: AbortSignal, handlers: StreamHandlers) {
  try {
    const response = await fetch(url, {
      headers: {
        ...buildHeaders(),
        Accept: "text/event-stream, application/x-ndjson",
      },
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream request failed with ${response.status}`);
    }

    handlers.onState("live");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (!signal.aborted) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n|\r?\n(?=\{)/);
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const patch = parseStreamFrame(part);

        if (patch) {
          handlers.onPatch(patch);
        }
      }
    }
  } catch (error) {
    if (!signal.aborted) {
      handlers.onState("offline");
      handlers.onError?.(error instanceof Error ? error : new Error("Unknown stream failure"));
    }
  }
}

function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
}

function buildHeaders(): HeadersInit {
  const token = window.localStorage.getItem("ledger.authToken");
  const tenant = window.localStorage.getItem("ledger.tenantId") ?? import.meta.env.VITE_TENANT_ID;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (tenant) {
    headers["X-Tenant-ID"] = tenant;
  }

  return headers;
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
