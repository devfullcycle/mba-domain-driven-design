import { Global, Module, OnModuleInit } from '@nestjs/common';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StoredEventMysqlRepository } from '../@core/stored-events/infra/db/repositories/stored-event-mysql.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { IDomainEvent } from '../@core/common/domain/domain-event';
import { ModuleRef } from '@nestjs/core';
import { StoredEventSchema } from '../@core/stored-events/infra/db/schemas';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([StoredEventSchema])],
  providers: [
    DomainEventManager,
    IntegrationEventsPublisher,
    {
      provide: 'IStoredEventRepository',
      useFactory: (em) => new StoredEventMysqlRepository(em),
      inject: [EntityManager],
    },
  ],
  exports: [DomainEventManager],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.domainEventManager.register('*', async (event: IDomainEvent) => {
      const repo = await this.moduleRef.resolve('IStoredEventRepository');
      await repo.add(event);
    });
  }
}
