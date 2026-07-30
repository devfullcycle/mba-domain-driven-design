import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
  WaitingListSchema,
  WaitingListEntrySchema,
} from '../@core/events/infra/db/schemas';
import { PartnerMysqlRepository } from '../@core/events/infra/db/repositories/partner-mysql.repository';
import { EntityManager } from '@mikro-orm/mysql';
import { CustomerMysqlRepository } from '../@core/events/infra/db/repositories/customer-mysql.repository';
import { EventMysqlRepository } from '../@core/events/infra/db/repositories/event-mysql.repository';
import { OrderMysqlRepository } from '../@core/events/infra/db/repositories/order-mysql.repository';
import { SpotReservationMysqlRepository } from '../@core/events/infra/db/repositories/spot-reservation-mysql.repository';
import { WaitingListMysqlRepository } from '../@core/events/infra/db/repositories/waiting-list-mysql.repository';
import { PartnerService } from '../@core/events/application/partner.service';
import { CustomerService } from '../@core/events/application/customer.service';
import { EventService } from '../@core/events/application/event.service';
import { OrderService } from '../@core/events/application/order.service';
import { PaymentGateway } from '../@core/events/application/payment.gateway';
import { IPartnerRepository } from '../@core/events/domain/repositories/partner-repository.interface';
import { PartnersController } from './partners/partners.controller';
import { CustomersController } from './customers/customers.controller';
import { EventsController } from './events/events.controller';
import { EventSectionsController } from './events/event-sections.controller';
import { EventSpotsController } from './events/event-spots.controller';
import { OrdersController } from './orders/orders.controller';
import { WaitingListController } from './waiting-list/waiting-list.controller';
import { ApplicationModule } from '../application/application.module';
import { ApplicationService } from '../@core/common/application/application.service';
import { DomainEventManager } from '../@core/common/domain/domain-event-manager';
import { PartnerCreated } from '../@core/events/domain/events/domain-events/partner-created.event';
import { MyHandlerHandler } from '../@core/events/application/handlers/my-handler.handler';
import { ModuleRef } from '@nestjs/core';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IIntegrationEvent } from '../@core/common/domain/integration-event';
import { PartnerCreatedIntegrationEvent } from '../@core/events/domain/events/integration-events/partner-created.int-events';
import { OrderCancelledHandler } from '../@core/events/application/handlers/order-cancelled.handler';
import { EventSpotReleasedHandler } from '../@core/events/application/handlers/event-spot-released.handler';
import { WaitingListService } from '../@core/events/application/waiting-list.service';
import { IWaitingListRepository } from '../@core/events/domain/repositories/waiting-list-repository.interface';
import { SpotOfferedToWaitingCustomerIntegrationEvent } from '../@core/events/domain/events/integration-events/spot-offered-to-waiting-customer.int-events';
import { WaitingListController } from './waiting-list/waiting-list.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      CustomerSchema,
      PartnerSchema,
      EventSchema,
      EventSectionSchema,
      EventSpotSchema,
      OrderSchema,
      SpotReservationSchema,
      WaitingListSchema,
      WaitingListEntrySchema,
    ]),
    ApplicationModule,
    BullModule.registerQueue({
      name: 'integration-events',
    }),
  ],
  providers: [
    {
      provide: 'IPartnerRepository',
      useFactory: (em: EntityManager) => new PartnerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ICustomerRepository',
      useFactory: (em: EntityManager) => new CustomerMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IEventRepository',
      useFactory: (em: EntityManager) => new EventMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IOrderRepository',
      useFactory: (em: EntityManager) => new OrderMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'ISpotReservationRepository',
      useFactory: (em: EntityManager) => new SpotReservationMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: 'IWaitingListRepository',
      useFactory: (em: EntityManager) => new WaitingListMysqlRepository(em),
      inject: [EntityManager],
    },
    {
      provide: PartnerService,
      useFactory: (
        partnerRepo: IPartnerRepository,
        appService: ApplicationService,
      ) => new PartnerService(partnerRepo, appService),
      inject: ['IPartnerRepository', ApplicationService],
    },
    {
      provide: CustomerService,
      useFactory: (customerRepo, uow) => new CustomerService(customerRepo, uow),
      inject: ['ICustomerRepository', 'IUnitOfWork'],
    },
    {
      provide: EventService,
      useFactory: (eventRepo, partnerRepo, uow) =>
        new EventService(eventRepo, partnerRepo, uow),
      inject: ['IEventRepository', 'IPartnerRepository', 'IUnitOfWork'],
    },
    PaymentGateway,
    {
      provide: OrderService,
      useFactory: (
        orderRepo,
        customerRepo,
        eventRepo,
        spotReservationRepo,
        uow,
        paymentGateway,
        applicationService,
      ) =>
        new OrderService(
          orderRepo,
          customerRepo,
          eventRepo,
          spotReservationRepo,
          uow,
          paymentGateway,
          applicationService,
        ),
      inject: [
        'IOrderRepository',
        'ICustomerRepository',
        'IEventRepository',
        'ISpotReservationRepository',
        'IUnitOfWork',
        PaymentGateway,
        ApplicationService,
      ],
    },
    {
      provide: MyHandlerHandler,
      useFactory: (
        partnerRepo: IPartnerRepository,
        domainEventManager: DomainEventManager,
      ) => new MyHandlerHandler(partnerRepo, domainEventManager),
      inject: ['IPartnerRepository', DomainEventManager],
    },
    {
      provide: OrderCancelledHandler,
      useFactory: (orderRepo, uow) => new OrderCancelledHandler(orderRepo, uow),
      inject: ['IOrderRepository', 'IUnitOfWork'],
    },
    {
      provide: EventSpotReleasedHandler,
      useFactory: (eventRepo, partnerRepo, uow) =>
        new EventSpotReleasedHandler(eventRepo, partnerRepo, uow),
      inject: ['IEventRepository', 'IPartnerRepository', 'IUnitOfWork'],
    },
    {
      provide: WaitingListService,
      useFactory: (customerRepo, eventRepo, waitingListRepo, appService) =>
        new WaitingListService(
          customerRepo,
          eventRepo,
          waitingListRepo,
          appService,
        ),
      inject: [
        'ICustomerRepository',
        'IEventRepository',
        'IWaitingListRepository',
        ApplicationService,
      ],
    },
  ],
  controllers: [
    PartnersController,
    CustomersController,
    EventsController,
    EventSectionsController,
    EventSpotsController,
    OrdersController,
    WaitingListController,
  ],
})
export class EventsModule implements OnModuleInit {
  constructor(
    private readonly domainEventManager: DomainEventManager,
    private moduleRef: ModuleRef,
    @InjectQueue('integration-events')
    private integrationEventsQueue: Queue<IIntegrationEvent>,
  ) {}

  onModuleInit() {
    console.log('EventsModule initialized');
    MyHandlerHandler.listensTo().forEach((eventName: string) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler: MyHandlerHandler = await this.moduleRef.resolve(
          MyHandlerHandler,
        );
        await handler.handle(event);
      });
    });
    this.domainEventManager.registerForIntegrationEvent(
      PartnerCreated.name,
      async (event) => {
        console.log('integration events');
        const integrationEvent = new PartnerCreatedIntegrationEvent(event);
        await this.integrationEventsQueue.add(integrationEvent);
      },
    );

    // Registros dos novos handlers
    OrderCancelledHandler.listensTo().forEach((eventName: string) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler: OrderCancelledHandler = await this.moduleRef.resolve(
          OrderCancelledHandler,
        );
        await handler.handle(event);
      });
    });

    EventSpotReleasedHandler.listensTo().forEach((eventName: string) => {
      this.domainEventManager.register(eventName, async (event) => {
        const handler: EventSpotReleasedHandler = await this.moduleRef.resolve(
          EventSpotReleasedHandler,
        );
        await handler.handle(event);
      });
    });

    this.domainEventManager.registerForIntegrationEvent(
      SpotOfferedToWaitingCustomerIntegrationEvent.name,
      async (domainEvent) => {
        const integrationEvent =
          new SpotOfferedToWaitingCustomerIntegrationEvent(domainEvent);
        await this.integrationEventsQueue.add(integrationEvent);
      },
    );
  }
}
