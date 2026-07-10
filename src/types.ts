export type TerminalView =
  | 'positions'
  | 'transactions'
  | 'holdings'
  | 'risk'
  | 'cash'
  | 'performance'
  | 'audit';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DealRow = {
  id: string;
  account: string;
  ticker: string;
  instrument: string;
  quantity: number;
  price: number;
  marketValue: number;
  dailyPnl: number;
  totalPnl: number;
  risk: RiskLevel;
  status: 'ACTIVE' | 'PENDING' | 'REVIEW';
  desk: 'EQUITY' | 'CREDIT' | 'RATES' | 'CASH';
  updatedAt: string;
};

export type TerminalMetrics = {
  dailyPnl: number;
  activePositions: number;
  previousPositions: number;
  grossExposure: number;
  exposureDelta: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  cashBalance: number;
  cashDelta: number;
  lastUpdated: string;
  lastUpdatedDate: string;
};

export type StreamSnapshot = {
  rows?: DealRow[];
  metrics?: Partial<TerminalMetrics>;
};

export type SortKey =
  | 'account'
  | 'ticker'
  | 'instrument'
  | 'quantity'
  | 'price'
  | 'marketValue'
  | 'dailyPnl'
  | 'totalPnl'
  | 'risk'
  | 'status';

export type SortDirection = 'asc' | 'desc';
