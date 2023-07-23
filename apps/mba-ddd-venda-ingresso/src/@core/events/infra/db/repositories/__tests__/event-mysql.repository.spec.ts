import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import {
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  PartnerSchema,
} from '../../schemas';
import { Event } from '../../../../domain/entities/event.entity';
import { EventMysqlRepository } from '../event-mysql.repository';
import { Partner } from '../../../../domain/entities/partner.entity';
import { PartnerMysqlRepository } from '../partner-mysql.repository';

test('Event repository', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [EventSchema, EventSectionSchema, EventSpotSchema, PartnerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    type: 'mysql',
    forceEntityConstructor: true,
    debug: true,
  });
  await orm.schema.refreshDatabase();
  const em = orm.em.fork();
  const partnerRepo = new PartnerMysqlRepository(em);
  const eventRepo = new EventMysqlRepository(em);

  const partner = Partner.create({ name: 'Partner 1' });
  await partnerRepo.add(partner);
  const event = partner.initEvent({
    name: 'Event 1',
    date: new Date(),
    description: 'Event 1 description',
  });

  event.addSection({
    name: 'Section 1',
    description: 'Section 1 description',
    price: 100,
    total_spots: 1000,
  });

  await eventRepo.add(event);
  await em.flush();
  await em.clear();

  const eventFound = await eventRepo.findById(event.id);
  console.log(eventFound);

  await orm.close();
});
