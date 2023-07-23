import { IDomainEvent } from '../../../../common/domain/domain-event';
import { CustomerId } from '../../entities/customer.entity';
import { EventSpotId } from '../../entities/event-spot';

export class SpotReservationCreated implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventSpotId,
    readonly reservation_date: Date,
    readonly customer_id: CustomerId,
  ) {
    this.occurred_on = new Date();
  }
}
