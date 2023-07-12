import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { EventSectionId } from '../domain/entities/event-section';
import { EventSpotId } from '../domain/entities/event-spot';
import { Order } from '../domain/entities/order.entity';
import { SpotReservation } from '../domain/entities/spot-reservation.entity';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IOrderRepository } from '../domain/repositories/order-repository.interface';
import { ISpotReservationRepository } from '../domain/repositories/spot-reservation-repository.interface';
import { PaymentGateway } from './payment.gateway';

export class OrderService {
  constructor(
    private orderRepo: IOrderRepository,
    private customerRepo: ICustomerRepository,
    private eventRepo: IEventRepository,
    private spotReservationRepo: ISpotReservationRepository,
    private uow: IUnitOfWork,
    private paymentGateway: PaymentGateway,
  ) {}

  list() {
    return this.orderRepo.findAll();
  }

  async create(input: {
    event_id: string;
    section_id: string;
    spot_id: string;
    customer_id: string;
    card_token: string;
  }) {
    //const {customer, event} = Promise.all([])
    const customer = await this.customerRepo.findById(input.customer_id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    const event = await this.eventRepo.findById(input.event_id);

    if (!event) {
      throw new Error('Event not found');
    }

    const sectionId = new EventSectionId(input.section_id);
    const spotId = new EventSpotId(input.spot_id);

    if (!event.allowReserveSpot({ section_id: sectionId, spot_id: spotId })) {
      throw new Error('Spot not available');
    }

    const spotReservation = await this.spotReservationRepo.findById(spotId);

    if (spotReservation) {
      throw new Error('Spot already reserved');
    }
    return this.uow.runTransaction(async () => {
      const spotReservationCreated = SpotReservation.create({
        spot_id: spotId,
        customer_id: customer.id,
      });

      await this.spotReservationRepo.add(spotReservationCreated);
      try {
        await this.uow.commit();
        const section = event.sections.find((s) => s.id.equals(sectionId));
        await this.paymentGateway.payment({
          token: input.card_token,
          amount: section.price,
        });

        const order = Order.create({
          customer_id: customer.id,
          event_spot_id: spotId,
          amount: section.price,
        });
        order.pay();
        await this.orderRepo.add(order);

        event.markSpotAsReserved({
          section_id: sectionId,
          spot_id: spotId,
        });

        this.eventRepo.add(event);

        await this.uow.commit();
        return order;
      } catch (e) {
        const section = event.sections.find((s) => s.id.equals(sectionId));
        const order = Order.create({
          customer_id: customer.id,
          event_spot_id: spotId,
          amount: section.price,
        });
        order.cancel();
        this.orderRepo.add(order);
        await this.uow.commit();
        throw new Error('Aconteceu um erro reservar o seu lugar');
      }
    });
  }
}
