import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../domain/entities/partner.entity';

test('deve criar um partner', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
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

  const partner = Partner.create({ name: 'Partner 1' });
  console.log(partner.id);
  em.persist(partner);
  await em.flush();
  await em.clear(); // limpa o cache do entity manager (unit of work)

  const partnerFound = await em.findOne(Partner, { id: partner.id });
  console.log(partnerFound);

  await orm.close();
});
