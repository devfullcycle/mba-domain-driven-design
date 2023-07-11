export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  completeTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  runTransaction<T>(callback: () => Promise<T>): Promise<T>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
