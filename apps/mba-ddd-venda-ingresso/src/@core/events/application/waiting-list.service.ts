import { ApplicationService } from '../../common/application/application.service';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { IEventRepository } from '../domain/repositories/event-repository.interface';
import { IWaitingListRepository } from '../domain/repositories/waiting-list-repository.interface';
import { CustomerId } from '../domain/entities/customer.entity';
import { EventId } from '../domain/entities/event.entity';
import { EventSectionId } from '../domain/entities/event-section';
import { WaitingList } from '../domain/entities/waiting-list.entity';

export class WaitingListService {
  constructor(
    private customerRepo: ICustomerRepository,
    private eventRepo: IEventRepository,
    private waitingListRepo: IWaitingListRepository,
    private applicationService: ApplicationService,
  ) {}

  async joinWaitingList(input: {
    event_id: string;
    section_id: string;
    customer_id: string;
  }) {
    return this.applicationService.run(async () => {
      const customer = await this.customerRepo.findById(input.customer_id);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const event = await this.eventRepo.findById(input.event_id);
      if (!event) {
        throw new Error('Event not found');
      }

      const section = event.sections.find((s) =>
        s.id.equals(new EventSectionId(input.section_id)),
      );
      if (!section) {
        throw new Error('Section not found');
      }

      // Verifica esgotamento: deriva da disponibilidade dos spots
      const hasAvailable = [...section.spots].some(
        (spot) => !spot.is_reserved && spot.is_published,
      );
      if (hasAvailable) {
        throw new Error('Section is not sold out');
      }

      let waitingList = await this.waitingListRepo.findByEventAndSection(
        new EventId(input.event_id),
        new EventSectionId(input.section_id),
      );

      if (!waitingList) {
        waitingList = WaitingList.create({
          event_id: new EventId(input.event_id),
          section_id: new EventSectionId(input.section_id),
        });
      }

      waitingList.addEntry(new CustomerId(input.customer_id));
      await this.waitingListRepo.add(waitingList);
      return waitingList.toJSON();
    });
  }

  async listWaitingList(event_id: string, section_id: string) {
    const wl = await this.waitingListRepo.findByEventAndSection(
      new EventId(event_id),
      new EventSectionId(section_id),
    );
    return wl ? wl.toJSON() : { entries: [] };
  }
}
