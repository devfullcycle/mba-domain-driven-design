import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventId } from '../../entities/event.entity';

export class EventChangedDescription implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventId,
    readonly description: string | null,
  ) {
    this.occurred_on = new Date();
  }
}
