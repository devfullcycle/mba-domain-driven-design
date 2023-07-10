export interface IUnitOfWork {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
