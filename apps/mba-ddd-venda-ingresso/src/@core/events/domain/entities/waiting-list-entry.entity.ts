import { AggregateRoot } from '../../../common/domain/aggregate-root';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { CustomerId } from './customer.entity';

export class WaitingListEntryId extends Uuid {}

export enum WaitingListEntryStatus {
  PENDING = 'PENDING',
  NOTIFIED = 'NOTIFIED',
}

export type WaitingListEntryConstructorProps = {
  id?: WaitingListEntryId | string;
  customer_id: CustomerId;
  status?: WaitingListEntryStatus;
};

export type WaitingListEntryProps = WaitingListEntryConstructorProps; // alias for constructor

export class WaitingListEntry extends AggregateRoot {
  id: WaitingListEntryId;
  customer_id: CustomerId;
  status: WaitingListEntryStatus = WaitingListEntryStatus.PENDING;

  constructor(props: WaitingListEntryProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new WaitingListEntryId(props.id)
        : props.id ?? new WaitingListEntryId();
    this.customer_id =
      props.customer_id instanceof CustomerId
        ? props.customer_id
        : new CustomerId(props.customer_id);
    this.status = props.status ?? WaitingListEntryStatus.PENDING;
  }

  static create(props: WaitingListEntryConstructorProps) {
    const entry = new WaitingListEntry(props);
    return entry;
  }

  notify() {
    if (this.status === WaitingListEntryStatus.NOTIFIED) {
      return;
    }
    this.status = WaitingListEntryStatus.NOTIFIED;
  }

  toJSON() {
    return {
      id: this.id.value,
      customer_id: this.customer_id.value,
      status: this.status,
    };
  }
}
