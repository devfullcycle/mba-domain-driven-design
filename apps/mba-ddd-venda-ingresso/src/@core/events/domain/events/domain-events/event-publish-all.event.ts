import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventSectionId } from '../../entities/event-section';
import { EventId } from '../../entities/event.entity';

export class EventPublishAll implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  readonly is_published: boolean = true;

  constructor(
    readonly aggregate_id: EventId,
    readonly sections_id: EventSectionId[],
  ) {
    this.occurred_on = new Date();
  }
}
