import { IRepository } from '../../../common/domain/repository-interface';
import { Order } from '../entities/order.entity';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOrderRepository extends IRepository<Order> {}
