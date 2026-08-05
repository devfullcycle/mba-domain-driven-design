import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
  WaitingListSchema,
  WaitingListEntrySchema,
} from '../@core/events/infra/db/schemas';
import { StoredEventSchema } from '../@core/stored-events/infra/db/schemas';
import { EntityManager } from '@mikro-orm/mysql';
import { UnitOfWorkMikroOrm } from '../@core/common/infra/unit-of-work-mikro-orm';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [
        CustomerSchema,
        PartnerSchema,
        EventSchema,
        EventSectionSchema,
        EventSpotSchema,
        OrderSchema,
        SpotReservationSchema,
        WaitingListSchema,
        WaitingListEntrySchema,
        StoredEventSchema,
      ],
      dbName: 'events',
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'root',
      type: 'mysql',
      forceEntityConstructor: true,
    }),
  ],
  providers: [
    {
      provide: 'IUnitOfWork',
      useFactory(em: EntityManager) {
        return new UnitOfWorkMikroOrm(em);
      },
      inject: [EntityManager],
    },
  ],
  exports: ['IUnitOfWork'],
})
export class DatabaseModule {}
