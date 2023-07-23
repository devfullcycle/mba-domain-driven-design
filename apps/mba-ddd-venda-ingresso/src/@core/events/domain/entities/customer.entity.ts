import { AggregateRoot } from '../../../common/domain/aggregate-root';
import Cpf from '../../../common/domain/value-objects/cpf.vo';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { CustomerChangedName } from '../events/domain-events/customer-changed-name.event';
import { CustomerCreated } from '../events/domain-events/customer-created.event';

export class CustomerId extends Uuid {}

export type CustomerConstructorProps = {
  id?: CustomerId | string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: CustomerId;
  cpf: Cpf;
  name: string;

  constructor(props: CustomerConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new CustomerId(props.id)
        : props.id ?? new CustomerId();
    this.cpf = props.cpf;
    this.name = props.name;
  }

  static create(command: { name: string; cpf: string }) {
    const customer = new Customer({
      name: command.name,
      cpf: new Cpf(command.cpf),
    });
    customer.addEvent(
      new CustomerCreated(customer.id, customer.name, customer.cpf),
    );
    return customer;
  }

  changeName(name: string) {
    this.name = name;
    this.addEvent(new CustomerChangedName(this.id, this.name));
  }

  toJSON() {
    return {
      id: this.id.value,
      cpf: this.cpf.value,
      name: this.name,
    };
  }
}
