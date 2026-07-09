import { Terminal } from "./components/Terminal";
import { useDealTerminal } from "./hooks/useDealTerminal";

export default function App() {
  const terminal = useDealTerminal();

  return (
    <Terminal
      records={terminal.records}
      activeFolder={terminal.activeFolder}
      onFolderChange={terminal.setActiveFolder}
      streamState={terminal.streamState}
      lastError={terminal.lastError}
    />
  );
}
