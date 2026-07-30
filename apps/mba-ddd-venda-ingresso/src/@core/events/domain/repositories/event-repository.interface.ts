import { IRepository } from '../../../common/domain/repository-interface';
import { Event } from '../entities/event.entity';
import { EventSpotId } from '../entities/event-spot';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEventRepository extends IRepository<Event> {
  findByEventSpotId(spotId: EventSpotId): Promise<Event | null>;
}
