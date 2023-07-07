import { AggregateRoot } from '../../../common/domain/aggregate-root';
import Cpf from '../../../common/domain/value-objects/cpf.vo';

export type CustomerConstructorProps = {
  id?: string;
  cpf: Cpf;
  name: string;
};

export class Customer extends AggregateRoot {
  id: string;
  cpf: Cpf;
  name: string;

  constructor(props: CustomerConstructorProps) {
    super();
    this.id = props.id;
    this.cpf = props.cpf;
    this.name = props.name;
  }

  static create(command: { name: string; cpf: string }) {
    return new Customer({
      name: command.name,
      cpf: new Cpf(command.cpf),
    });
  }

  toJSON() {
    return {
      id: this.id,
      cpf: this.cpf,
      name: this.name,
    };
  }
}
