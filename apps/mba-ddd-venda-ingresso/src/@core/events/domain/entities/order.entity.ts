import { AggregateRoot } from '../../../common/domain/aggregate-root';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { OrderCancelled } from '../events/domain-events/order-cancelled.event';
import { OrderCreated } from '../events/domain-events/order-created.event';
import { OrderPaid } from '../events/domain-events/order-paid.event';
import { CustomerId } from './customer.entity';
import { EventSpotId } from './event-spot';

export enum OrderStatus {
  PENDING,
  PAID,
  CANCELLED,
}

export class OrderId extends Uuid {}

export type OrderConstructorProps = {
  id?: OrderId | string;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
};

export class Order extends AggregateRoot {
  id: OrderId;
  customer_id: CustomerId;
  amount: number;
  event_spot_id: EventSpotId;
  status: OrderStatus = OrderStatus.PENDING;

  constructor(props: OrderConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new OrderId(props.id)
        : props.id ?? new OrderId();
    this.amount = props.amount;
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
    this.event_spot_id =
      props.event_spot_id instanceof EventSpotId
        ? props.event_spot_id
        : new EventSpotId(props.event_spot_id);
  }

  static create(props: OrderConstructorProps) {
    const order = new Order(props);
    order.addEvent(
      new OrderCreated(
        order.id,
        order.customer_id,
        order.amount,
        order.event_spot_id,
        order.status,
      ),
    );
    return order;
  }

  pay() {
    this.status = OrderStatus.PAID;
    this.addEvent(new OrderPaid(this.id, this.status));
  }

  cancel() {
    this.status = OrderStatus.CANCELLED;
    this.addEvent(new OrderCancelled(this.id, this.status));
  }

  toJSON() {
    return {
      id: this.id.value,
      amount: this.amount,
      customer_id: this.customer_id.value,
      event_spot_id: this.event_spot_id.value,
    };
  }
}
