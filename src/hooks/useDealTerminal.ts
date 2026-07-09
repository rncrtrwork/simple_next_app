import { useEffect, useMemo, useState } from "react";
import { fetchDealSnapshot, openDealStream } from "../api/dealStream";
import {
  applyDealPatch,
  computeLedgerMetrics,
  type DealRecord,
  type FolderKey,
  makeMockPatch,
  seedDeals,
  selectFolder,
  type StreamState,
} from "../domain/deals";

export function useDealTerminal() {
  const [records, setRecords] = useState<DealRecord[]>(seedDeals);
  const [activeFolder, setActiveFolder] = useState<FolderKey>("live");
  const [streamState, setStreamState] = useState<StreamState>("connecting");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();

    void fetchDealSnapshot(abort.signal)
      .then((snapshot) => {
        if (snapshot.length > 0) {
          setRecords(snapshot);
        }
      })
      .catch((error: Error) => {
        setLastError(error.message);
        setStreamState("replaying");
      });

    const stream = openDealStream({
      onPatch: (patch) => setRecords((current) => applyDealPatch(current, patch)),
      onState: setStreamState,
      onError: (error) => setLastError(error.message),
    });

    return () => {
      abort.abort();
      stream.close();
    };
  }, []);

  useEffect(() => {
    if (streamState !== "replaying") {
      return undefined;
    }

    let tick = 0;
    const interval = window.setInterval(() => {
      setRecords((current) => applyDealPatch(current, makeMockPatch(current, tick++)));
    }, 1800);

    return () => window.clearInterval(interval);
  }, [streamState]);

  const visibleRecords = useMemo(
    () => selectFolder(records, activeFolder),
    [records, activeFolder],
  );

  const metrics = useMemo(() => computeLedgerMetrics(visibleRecords), [visibleRecords]);

  return {
    records,
    visibleRecords,
    activeFolder,
    setActiveFolder,
    streamState,
    metrics,
    lastError,
  };
}
