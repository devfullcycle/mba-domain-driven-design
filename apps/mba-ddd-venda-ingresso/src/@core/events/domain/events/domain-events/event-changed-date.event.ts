import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventId } from '../../entities/event.entity';

export class EventChangedDate implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(readonly aggregate_id: EventId, readonly date: Date) {
    this.occurred_on = new Date();
  }
}
