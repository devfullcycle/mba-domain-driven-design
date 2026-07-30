import { EntityManager } from '@mikro-orm/mysql';
import {
  WaitingList,
  WaitingListId,
} from '../../../domain/entities/waiting-list.entity';
import { IWaitingListRepository } from '../../../domain/repositories/waiting-list-repository.interface';
import { EventId } from '../../../domain/entities/event.entity';
import { EventSectionId } from '../../../domain/entities/event-section';

export class WaitingListMysqlRepository implements IWaitingListRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: WaitingList): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: string | WaitingListId): Promise<WaitingList | null> {
    return this.entityManager.findOne(WaitingList, {
      id: typeof id === 'string' ? new WaitingListId(id) : id,
    });
  }

  async findAll(): Promise<WaitingList[]> {
    return this.entityManager.find(WaitingList, {});
  }

  async delete(entity: WaitingList): Promise<void> {
    await this.entityManager.remove(entity);
  }

  async findByEventAndSection(
    eventId: EventId,
    sectionId: EventSectionId,
  ): Promise<WaitingList | null> {
    return this.entityManager.findOne(WaitingList, {
      event_id: eventId,
      section_id: sectionId,
    });
  }
}
