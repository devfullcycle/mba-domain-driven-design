import { IDomainEvent } from '../../../../common/domain/domain-event';
import { CustomerId } from '../../entities/customer.entity';
import { EventSpotId } from '../../entities/event-spot';
import { OrderId, OrderStatus } from '../../entities/order.entity';

export class OrderCreated implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: OrderId,
    readonly customer_id: CustomerId,
    readonly amount: number,
    readonly event_spot_id: EventSpotId,
    readonly status: OrderStatus,
  ) {
    this.occurred_on = new Date();
  }
}
