import { IDomainEventHandler } from '../../../common/application/domain-event-handler.interface';
import { DomainEventManager } from '../../../common/domain/domain-event-manager';
import { EventSpotReleased } from '../../domain/events/domain-events/event-spot-released.event';
import { IWaitingListRepository } from '../../domain/repositories/waiting-list-repository.interface';
import { IEventRepository } from '../../domain/repositories/event-repository.interface';

export class EventSpotReleasedHandler implements IDomainEventHandler {
  constructor(
    private waitingListRepo: IWaitingListRepository,
    private eventRepo: IEventRepository,
    private domainEventManager: DomainEventManager,
  ) {}

  async handle(event: EventSpotReleased): Promise<void> {
    const waitingList = await this.waitingListRepo.findByEventAndSection(
      event.event_id,
      event.section_id,
    );

    if (!waitingList) {
      return; // sem fila, nada a fazer
    }

    const integrationEventOrNull = waitingList.offerSpotToNext(event.spot_id);
    if (!integrationEventOrNull) {
      return; // sem entradas pendentes
    }

    await this.waitingListRepo.add(waitingList);
    await this.domainEventManager.publish(waitingList);
    await this.domainEventManager.publishForIntegrationEvent(waitingList);
  }

  static listensTo(): string[] {
    return [EventSpotReleased.name];
  }
}
