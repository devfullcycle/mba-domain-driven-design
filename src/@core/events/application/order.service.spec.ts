import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from '../infra/db/schemas';
import { CustomerMysqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
import { PartnerMysqlRepository } from '../infra/db/repositories/partner-mysql.repository';
import { Partner } from '../domain/entities/partner.entity';
import { EventMysqlRepository } from '../infra/db/repositories/event-mysql.repository';
import { OrderService } from './order.service';
import { OrderMysqlRepository } from '../infra/db/repositories/order-mysql.repository';
import { SpotReservationMysqlRepository } from '../infra/db/repositories/spot-reservation-mysql.repository';

test('deve criar uma order', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
    ],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const unitOfWork = new UnitOfWorkMikroOrm(em);
  const customerRepo = new CustomerMysqlRepository(em);
  const partnerRepo = new PartnerMysqlRepository(em);
  const eventRepo = new EventMysqlRepository(em);
  const customer = Customer.create({
    name: 'Customer 1',
    cpf: '70375887091',
  });
  await customerRepo.add(customer);

  const partner = Partner.create({
    name: 'Partner 1',
  });
  await partnerRepo.add(partner);

  const event = partner.initEvent({
    name: 'Event 1',
    description: 'Event 1',
    date: new Date(),
  });

  event.addSection({
    name: 'Section 1',
    description: 'Section 1',
    price: 100,
    total_spots: 1000,
  });

  event.publishAll();

  await eventRepo.add(event);

  await unitOfWork.commit();
  await em.clear();

  const orderRepo = new OrderMysqlRepository(em);
  const spotReservationRepo = new SpotReservationMysqlRepository(em);
  const orderService = new OrderService(
    orderRepo,
    customerRepo,
    eventRepo,
    spotReservationRepo,
    unitOfWork,
  );

  const op1 = orderService.create({
    event_id: event.id.value,
    section_id: event.sections[0].id.value,
    customer_id: customer.id.value,
    spot_id: event.sections[0].spots[0].id.value,
  });

  const op2 = orderService.create({
    event_id: event.id.value,
    section_id: event.sections[0].id.value,
    customer_id: customer.id.value,
    spot_id: event.sections[0].spots[0].id.value,
  });

  try {
    await Promise.all([op1, op2]);
  } catch (e) {
    console.log(e);
    console.log(await orderRepo.findAll());
    console.log(await spotReservationRepo.findAll());
  }

  await orm.close();
});
