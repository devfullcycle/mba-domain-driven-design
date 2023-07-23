import { IDomainEvent } from '../../../../common/domain/domain-event';
import Cpf from '../../../../common/domain/value-objects/cpf.vo';
import { CustomerId } from '../../entities/customer.entity';

export class CustomerCreated implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: CustomerId,
    readonly name: string,
    readonly cpf: Cpf,
  ) {
    this.occurred_on = new Date();
  }
}
