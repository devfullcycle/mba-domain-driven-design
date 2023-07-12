import { Global, Module } from '@nestjs/common';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';

@Global()
@Module({
  providers: [DomainEventManager],
  exports: [DomainEventManager],
})
export class DomainEventsModule {}
