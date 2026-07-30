import { EntityManager } from '@mikro-orm/mysql';
import { Event, EventId } from '../../../domain/entities/event.entity';
import { IEventRepository } from '../../../domain/repositories/event-repository.interface';
import { EventSpotId } from '../../../domain/entities/event-spot';

export class EventMysqlRepository implements IEventRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Event): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: string | EventId): Promise<Event> {
    return this.entityManager.findOne(Event, {
      id: typeof id === 'string' ? new EventId(id) : id,
    });
  }

  async findAll(): Promise<Event[]> {
    return this.entityManager.find(Event, {});
  }

  async findByEventSpotId(spotId: EventSpotId): Promise<Event | null> {
    const events = await this.entityManager.find(
      Event,
      {},
      { populate: ['sections'] },
    );
    for (const ev of events) {
      const sections = (ev.sections as any).getItems
        ? (ev.sections as any).getItems()
        : ev.sections;
      for (const section of sections) {
        await section.spots.init(); // ensure populated
        const spots = section.spots.getItems
          ? section.spots.getItems()
          : section.spots;
        if (spots.some((s: any) => s.id.equals(spotId))) {
          return ev;
        }
      }
    }
    return null;
  }

  async delete(entity: Event): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
