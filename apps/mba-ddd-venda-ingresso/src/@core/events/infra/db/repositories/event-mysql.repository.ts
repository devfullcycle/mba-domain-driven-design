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
    // Busca o Event que contém o spot via join nas seções
    return this.entityManager.findOne(
      Event,
      {
        sections: {
          spots: { id: spotId },
        },
      },
      { populate: ['sections.spots'] },
    );
  }

  async delete(entity: Event): Promise<void> {
    await this.entityManager.remove(entity);
  }
}
