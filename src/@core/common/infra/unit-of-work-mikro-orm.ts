import { EntityManager } from '@mikro-orm/mysql';
import { IUnitOfWork } from '../application/unit-of-work.interface';

export class UnitOfWorkMikroOrm implements IUnitOfWork {
  constructor(private em: EntityManager) {}

  commit(): Promise<void> {
    return this.em.flush();
  }

  async rollback(): Promise<void> {
    this.em.clear();
  }
}
