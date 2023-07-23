import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventId } from '../../entities/event.entity';

export class EventAddedSection implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventId,
    readonly section_name: string,
    readonly section_description: string | null,
    readonly section_total_spots: number,
    readonly section_price: number,
    readonly event_total_spots: number,
  ) {
    this.occurred_on = new Date();
  }
}
