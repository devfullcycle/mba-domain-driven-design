import { IRepository } from '../../../common/domain/repository-interface';
import { Customer } from '../entities/customer.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomerRepository extends IRepository<Customer> {}
