export interface BenchmarkWorkloadConfig {
  concurrentWorkers: number;
  journalsPerWorker: number;
  legsPerJournal: number;
  targetP99LatencyMs: number;
}

export const FLASH_SALE_LEDGER_WORKLOAD: BenchmarkWorkloadConfig = {
  concurrentWorkers: 250,
  journalsPerWorker: 1000,
  legsPerJournal: 4,
  targetP99LatencyMs: 25,
};
