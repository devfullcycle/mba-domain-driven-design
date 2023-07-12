import { IRepository } from '../../../common/domain/repository-interface';
import { Event } from '../entities/event.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEventRepository extends IRepository<Event> {}
