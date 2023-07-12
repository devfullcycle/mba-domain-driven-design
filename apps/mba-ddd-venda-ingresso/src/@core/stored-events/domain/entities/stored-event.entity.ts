import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { IDomainEvent } from '../../../common/domain/domain-event';
import Uuid from '../../../common/domain/value-objects/uuid.vo';

export class StoredEventId extends Uuid {}

export type StoredEventConstructorProps = {
  body: string;
  occurred_on: Date;
  type_name: string;
};

export type StoredEventCommand = {
  domain_event: IDomainEvent;
  occurred_on: Date;
};

export class StoredEvent extends AggregateRoot {
  id: StoredEventId;
  body: string;
  occurred_on: Date;
  type_name: string;

  constructor(props: StoredEventConstructorProps, id?: StoredEventId) {
    super();
    this.id = id ?? new StoredEventId();
    this.body = props.body;
    this.occurred_on = props.occurred_on;
    this.type_name = props.type_name;
  }

  static create(domainEvent: IDomainEvent) {
    return new StoredEvent({
      body: JSON.stringify(domainEvent),
      type_name: domainEvent.constructor.name,
      occurred_on: domainEvent.occurred_on,
    });
  }

  toJSON() {
    return {
      id: this.id,
      body: this.body,
      ocurred_on: this.occurred_on,
    };
  }
}
