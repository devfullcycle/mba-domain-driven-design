import { IDomainEvent } from '../domain/domain-event';

export interface IDomainEventHandler {
  handle(event: IDomainEvent): Promise<void>;
}
