import { IRepository } from '../../../common/domain/repository-interface';
import { WaitingList, WaitingListId } from '../entities/waiting-list.entity';
import { EventId } from '../entities/event';
import { EventSectionId } from '../entities/event-section';

export interface IWaitingListRepository extends IRepository<WaitingList> {
  findByEventAndSection(
    eventId: EventId,
    sectionId: EventSectionId,
  ): Promise<WaitingList | null>;
}
