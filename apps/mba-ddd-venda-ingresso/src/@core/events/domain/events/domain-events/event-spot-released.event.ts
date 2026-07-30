import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventId } from '../../entities/event';
import { EventSectionId } from '../../entities/event-section';
import { EventSpotId } from '../../entities/event-spot';

export class EventSpotReleased implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly event_id: EventId,
    readonly section_id: EventSectionId,
    readonly spot_id: EventSpotId,
  ) {
    this.occurred_on = new Date();
  }
}
