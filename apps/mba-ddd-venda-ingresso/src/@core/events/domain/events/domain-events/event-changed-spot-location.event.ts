import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventSectionId } from '../../entities/event-section';
import { EventSpotId } from '../../entities/event-spot';
import { EventId } from '../../entities/event.entity';

export class EventChangedSpotLocation implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventId,
    readonly section_id: EventSectionId,
    readonly spot_id: EventSpotId,
    readonly location: string,
  ) {
    this.occurred_on = new Date();
  }
}
