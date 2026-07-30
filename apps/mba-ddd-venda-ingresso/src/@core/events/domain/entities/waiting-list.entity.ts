import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { MyCollectionFactory } from '../../../common/domain/my-collection';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { CustomerId } from './customer.entity';
import { EventId } from './event';
import { EventSectionId } from './event-section';
import { SpotOfferedToWaitingCustomer } from '../events/domain-events/spot-offered-to-waiting-customer.event';
import { CustomerJoinedWaitingList } from '../events/domain-events/customer-joined-waiting-list.event';

export class WaitingListId extends Uuid {}
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

export type WaitingListConstructorProps = {
  id?: WaitingListId | string;
  event_id: EventId;
  section_id: EventSectionId;
  entries?: WaitingListEntry[];
};

export class WaitingList extends AggregateRoot {
  id: WaitingListId;
  event_id: EventId;
  section_id: EventSectionId;
  private _entries: WaitingListEntry[] = [];

  constructor(props: WaitingListConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new WaitingListId(props.id)
        : props.id ?? new WaitingListId();
    this.event_id =
      props.event_id instanceof EventId
        ? props.event_id
        : new EventId(props.event_id);
    this.section_id =
      props.section_id instanceof EventSectionId
        ? props.section_id
        : new EventSectionId(props.section_id);
    if (props.entries) {
      this._entries = props.entries;
    }
  }

  static create(props: WaitingListConstructorProps) {
    const wl = new WaitingList(props);
    return wl;
  }

  addEntry(customer_id: CustomerId) {
    const hasPending = this._entries.some(
      (e) =>
        e.customer_id.equals(customer_id) &&
        e.status === WaitingListEntryStatus.PENDING,
    );
    if (hasPending) {
      throw new Error('Customer already in waiting list');
    }
    const entry = WaitingListEntry.create({ customer_id });
    this._entries.push(entry);
    this.addEvent(
      new CustomerJoinedWaitingList(this.id, customer_id, this.event_id, this.section_id),
    );
  }

  offerSpotToNext(spot_id: EventSpotId): SpotOfferedToWaitingCustomer | null {
    const pendingEntry = this._entries.find(
      (e) => e.status === WaitingListEntryStatus.PENDING,
    );
    if (!pendingEntry) {
      return null;
    }
    pendingEntry.notify();
    const event = new SpotOfferedToWaitingCustomer(
      pendingEntry.customer_id,
      this.event_id,
      this.section_id,
      spot_id,
    );
    this.addEvent(event);
    return event;
  }

  get entries(): WaitingListEntry[] {
    return [...this._entries].sort((a, b) => a.id.value.localeCompare(b.id.value)); // simple order by arrival via id
  }

  toJSON() {
    return {
      id: this.id.value,
      event_id: this.event_id.value,
      section_id: this.section_id.value,
      entries: this.entries.map((e) => e.toJSON()),
    };
  }
}
