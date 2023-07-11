import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private em: EntityManager) {}

  beginTransaction(): Promise<void> {
    return this.em.begin();
  }
  completeTransaction(): Promise<void> {
    return this.em.commit();
  }
  rollbackTransaction(): Promise<void> {
    return this.em.rollback();
  }

  runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.em.transactional(callback);
  }

  commit(): Promise<void> {
    return this.em.flush();
  }

  async rollback(): Promise<void> {
    this.em.clear();
  }
}
