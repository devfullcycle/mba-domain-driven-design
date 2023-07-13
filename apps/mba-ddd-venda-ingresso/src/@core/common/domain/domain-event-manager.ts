import EventEmitter2 from 'eventemitter2';
import { AggregateRoot } from './aggregate-root';

export class DomainEventManager {
  domainEventsSubscriber: EventEmitter2;
  integrationEventsSubscriber: EventEmitter2;

  constructor() {
    this.domainEventsSubscriber = new EventEmitter2({
      wildcard: true,
    });
    this.integrationEventsSubscriber = new EventEmitter2({
      wildcard: true,
    });
  }

  register(event: string, handler: any) {
    this.domainEventsSubscriber.on(event, handler);
  }

  registerForIntegrationEvent(event: string, handler: any) {
    this.integrationEventsSubscriber.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.domainEventsSubscriber.emitAsync(eventClassName, event);
    }
  }

  async publishForIntegrationEvent(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const eventClassName = event.constructor.name;
      await this.integrationEventsSubscriber.emitAsync(eventClassName, event);
    }
  }
}
