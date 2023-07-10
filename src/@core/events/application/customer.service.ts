import { Customer } from '../domain/entities/customer.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
//sequelize - unit of work begin transaction 
export class CustomerService {
  constructor(private customerRepo: ICustomerRepository) {}

  list() {
    return this.customerRepo.findAll();
  }

  register(input: { name: string; cpf: string }) {
    const customer = Customer.create(input);
    this.customerRepo.add(customer); 
    return customer;
  }
}
