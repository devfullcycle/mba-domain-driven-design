import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Job } from 'bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-event';
import { Process, Processor } from '@nestjs/bull';

@Processor('integration-events')
export class IntegrationEventsPublisher {
  constructor(private amqpConnection: AmqpConnection) {}

  @Process()
  async handle(job: Job<IIntegrationEvent>) {
    console.log('IntegrationEventsPublisher.handle', job.data);
    await this.amqpConnection.publish(
      'amq.direct',
      //events.fullcycle.com/PartnerCreated
      job.data.event_name,
      job.data,
    );
    return {};
  }
}
