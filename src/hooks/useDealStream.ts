import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { initialMetrics, terminalRows } from '../data/mockTerminal';
import type { DealRow, StreamSnapshot, TerminalMetrics, TerminalView } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const SNAPSHOT_PATH = (import.meta.env.VITE_SNAPSHOT_PATH as string | undefined) ?? '/api/terminal/snapshot';
const STREAM_PATH = (import.meta.env.VITE_STREAM_PATH as string | undefined) ?? '/api/terminal/stream';

const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

const buildUrl = (path: string, view: TerminalView) => {
  if (!API_BASE_URL) return '';
  const url = new URL(joinUrl(API_BASE_URL, path));
  url.searchParams.set('view', view);
  return url.toString();
};

const normalizeRows = (payload: StreamSnapshot): DealRow[] | undefined =>
  Array.isArray(payload.rows) ? payload.rows : undefined;

const tickTime = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

export const useDealStream = (view: TerminalView) => {
  const [rows, setRows] = useState<DealRow[]>(terminalRows);
  const [metrics, setMetrics] = useState<TerminalMetrics>(initialMetrics);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const refresh = useCallback(async () => {
    const snapshotUrl = buildUrl(SNAPSHOT_PATH, view);
    setLoading(true);
    setError(null);

    if (!snapshotUrl) {
      setRows(terminalRows);
      setMetrics((current) => ({ ...current, lastUpdated: tickTime() }));
      setConnected(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(snapshotUrl, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Snapshot request failed with ${response.status}`);
      const payload = (await response.json()) as StreamSnapshot;
      const nextRows = normalizeRows(payload);
      if (nextRows) setRows(nextRows);
      if (payload.metrics) setMetrics((current) => ({ ...current, ...payload.metrics }));
      setConnected(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load terminal snapshot');
      setRows(terminalRows);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    eventSourceRef.current?.close();
    const streamUrl = buildUrl(STREAM_PATH, view);

    if (!streamUrl) {
      const timer = window.setInterval(() => {
        setMetrics((current) => ({ ...current, lastUpdated: tickTime() }));
        setConnected(true);
      }, 5000);
      return () => window.clearInterval(timer);
    }

    const source = new EventSource(streamUrl);
    eventSourceRef.current = source;

    source.onopen = () => {
      setConnected(true);
      setError(null);
    };

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as StreamSnapshot;
        const nextRows = normalizeRows(payload);
        if (nextRows) setRows(nextRows);
        if (payload.metrics) setMetrics((current) => ({ ...current, ...payload.metrics }));
      } catch {
        setError('Received an unreadable stream frame');
      }
    };

    source.onerror = () => {
      setConnected(false);
      setError('Streaming connection interrupted');
    };

    return () => source.close();
  }, [view]);

  return useMemo(
    () => ({ rows, metrics, connected, loading, error, refresh }),
    [rows, metrics, connected, loading, error, refresh],
  );
};
