import {
  ArrowLeftRight,
  BriefcaseBusiness,
  ChartColumnIncreasing,
  CircleDollarSign,
  ClipboardList,
  PieChart,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import type { TerminalView } from '../types';

type FolderTab = {
  id: TerminalView;
  label: string;
  Icon: LucideIcon;
};

const tabs: FolderTab[] = [
  { id: 'positions', label: 'Positions', Icon: PieChart },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight },
  { id: 'holdings', label: 'Holdings', Icon: BriefcaseBusiness },
  { id: 'risk', label: 'Risk Exposure', Icon: Shield },
  { id: 'cash', label: 'Cash Flow', Icon: CircleDollarSign },
  { id: 'performance', label: 'Performance', Icon: ChartColumnIncreasing },
  { id: 'audit', label: 'Audit Trail', Icon: ClipboardList },
];

type FolderTabsProps = {
  activeView: TerminalView;
  onChange: (view: TerminalView) => void;
};

export function FolderTabs({ activeView, onChange }: FolderTabsProps) {
  return (
    <nav className="folder-rail" aria-label="Terminal folders">
      {tabs.map(({ id, label, Icon }) => {
        const active = id === activeView;

        return (
          <button
            className={`folder-tab ${active ? 'folder-tab-active' : ''}`}
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
          >
            <img className="folder-tab-image" src="/assets/folder-tab.png" alt="" aria-hidden="true" />
            <span className="folder-tab-content">
              <Icon size={25} strokeWidth={1.75} />
              <span>{label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
