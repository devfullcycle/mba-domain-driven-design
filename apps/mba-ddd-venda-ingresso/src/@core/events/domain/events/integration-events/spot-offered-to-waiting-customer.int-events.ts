import { IIntegrationEvent } from '../../../../common/domain/integration-event';
import { SpotOfferedToWaitingCustomer } from '../../domain/events/domain-events/spot-offered-to-waiting-customer.event';

export class SpotOfferedToWaitingCustomerIntegrationEvent
  implements IIntegrationEvent
{
  readonly event_version: number = 1;
  readonly occurred_on: Date;
  readonly payload: {
    customer_id: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  };

  constructor(domainEvent: SpotOfferedToWaitingCustomer) {
    this.occurred_on = domainEvent.occurred_on;
    this.payload = {
      customer_id: domainEvent.customer_id.value,
      event_id: domainEvent.event_id.value,
      section_id: domainEvent.section_id.value,
      spot_id: domainEvent.spot_id.value,
    };
  }

  get name(): string {
    return SpotOfferedToWaitingCustomerIntegrationEvent.name;
  }
}
