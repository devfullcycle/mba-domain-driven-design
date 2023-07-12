import { Global, Module } from '@nestjs/common';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { IntegrationEventsPublisher } from './integration-events.publisher';

@Global()
@Module({
  providers: [DomainEventManager, IntegrationEventsPublisher],
  exports: [DomainEventManager],
})
export class DomainEventsModule {}
