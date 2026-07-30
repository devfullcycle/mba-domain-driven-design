import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'PartnerCreatedIntegrationEvent',
    //routingKey: 'events.fullcycle.com/*',
    queue: 'emails',
  })
  handle(msg: { event_name: string; [key: string]: any }) {
    // switch(msg.event_name) {
    //     case 'PartnerCreatedIntegrationEvent':

    //     case 'PartnerUpdatedIntegrationEvent':
    // }
    console.log('ConsumerService.handle', msg);
  }

  @RabbitSubscribe({
    exchange: 'amq.direct',
    routingKey: 'SpotOfferedToWaitingCustomerIntegrationEvent',
    queue: 'emails',
  })
  handleSpotOffered(msg: { payload: any }) {
    const p = msg.payload;
    console.log(
      `Nova vaga! Notificando cliente ${p.customer_id} para seção ${p.section_id} (spot ${p.spot_id})`,
    );
  }
}
