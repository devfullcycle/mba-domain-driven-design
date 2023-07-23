import { IDomainEvent } from '../../../../common/domain/domain-event';
import { EventSectionId } from '../../entities/event-section';
import { EventSpotId } from '../../entities/event-spot';
import { EventId } from '../../entities/event.entity';

export class EventMarkedSportAsReserved implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;
  readonly spot_is_reserved: boolean = true;

  constructor(
    readonly aggregate_id: EventId,
    readonly section_id: EventSectionId,
    readonly spot_id: EventSpotId,
  ) {
    this.occurred_on = new Date();
  }
}
