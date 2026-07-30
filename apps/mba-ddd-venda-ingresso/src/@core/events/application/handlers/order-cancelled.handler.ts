import { IDomainEventHandler } from '../../../common/application/domain-event-handler.interface';
import { DomainEventManager } from '../../../common/domain/domain-event-manager';
import { OrderCancelled } from '../../domain/events/domain-events/order-cancelled.event';
import { IEventRepository } from '../../domain/repositories/event-repository.interface';
import { ISpotReservationRepository } from '../../domain/repositories/spot-reservation-repository.interface';
import { EventSpotId } from '../../domain/entities/event-spot';

export class OrderCancelledHandler implements IDomainEventHandler {
  constructor(
    private eventRepo: IEventRepository,
    private spotReservationRepo: ISpotReservationRepository,
    private domainEventManager: DomainEventManager,
  ) {}

  async handle(event: OrderCancelled): Promise<void> {
    const spotId = event.event_spot_id;
    const eventAggregate = await this.eventRepo.findByEventSpotId(spotId);

    if (!eventAggregate) {
      throw new Error('Event not found for spot');
    }

    // Encontra a seção que contém o spot (lógica no agregado)
    eventAggregate.markSpotAsAvailable(spotId as any); // cast temporário até assinatura sem section_id

    // Remove a SpotReservation
    // Encontra e deleta a reserva (pretende implementar find por spot)
    const reservation = await this.spotReservationRepo.findBySpotId(spotId);
    if (reservation) {
      await this.spotReservationRepo.delete(reservation);
    }

    // Persist e publica eventos do agregado modificado
    await this.eventRepo.add(eventAggregate);
    await this.domainEventManager.publish(eventAggregate);
  }

  static listensTo(): string[] {
    return [OrderCancelled.name];
  }
}
