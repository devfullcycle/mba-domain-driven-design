import { IIntegrationEvent } from '../../../../common/domain/integration-event';
import { SpotOfferedToWaitingCustomer } from '../domain-events/spot-offered-to-waiting-customer.event';

export class SpotOfferedToWaitingCustomerIntegrationEvent
  implements IIntegrationEvent
{
  event_name: string;
  payload: {
    customer_id: string;
    event_id: string;
    section_id: string;
    spot_id: string;
  };
  event_version: number;
  occurred_on: Date;

  constructor(domainEvent: SpotOfferedToWaitingCustomer) {
    this.event_name = SpotOfferedToWaitingCustomerIntegrationEvent.name;
    this.event_version = 1;
    this.occurred_on = domainEvent.occurred_on;
    this.payload = {
      customer_id: domainEvent.customer_id.value,
      event_id: domainEvent.event_id.value,
      section_id: domainEvent.section_id.value,
      spot_id: domainEvent.spot_id.value,
    };
  }
}
