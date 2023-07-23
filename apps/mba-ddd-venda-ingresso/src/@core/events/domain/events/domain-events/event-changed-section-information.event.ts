import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventSectionId } from '../../entities/event-section';
import { EventId } from '../../entities/event.entity';

export class EventChangedSectionSection implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventId,
    readonly section_id: EventSectionId,
    readonly section_name: string,
    readonly section_description: string | null,
  ) {
    this.occurred_on = new Date();
  }
}
