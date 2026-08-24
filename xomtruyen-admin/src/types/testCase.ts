export type TestArea = 'API' | 'CLIENT' | 'UI_UX' | 'BUG_LOG';
export type TestStatus = 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED' | 'SKIPPED' | 'MANUAL';
export type BugSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface TestCase {
  id: string;
  title: string;
  area: TestArea;
  description: string;
  expected: string;
  automated: boolean;
  status: TestStatus;
  lastMessage?: string;
  lastRunAt?: string;
  durationMs?: number;
}

export interface BugLog {
  id: string;
  testCaseId?: string;
  area: TestArea;
  severity: BugSeverity;
  title: string;
  message: string;
  expected?: string;
  actual?: string;
  source: 'AUTOMATED' | 'MANUAL';
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export interface TestRunSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  manual: number;
  startedAt: string;
  finishedAt?: string;
}
