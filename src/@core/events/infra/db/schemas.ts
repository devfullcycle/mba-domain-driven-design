import { Cascade, EntitySchema } from '@mikro-orm/core';
import { Partner } from '../../domain/entities/partner.entity';
import { PartnerIdSchemaType } from './types/partner-id.schema-type';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerIdSchemaType } from './types/customer-id.schema-type';
import { CpfSchemaType } from './types/cpf.schema-type';
import { EventIdSchemaType } from './types/event-id.schema-type';
import { EventSection } from '../../domain/entities/event-section';
import { EventSectionIdSchemaType } from './types/event-section-id.schema-type';
import { EventSpot } from '../../domain/entities/event-spot';
import { EventSpotIdSchemaType } from './types/event-spot-id.schema-type';
import { Event } from '../../domain/entities/event.entity';
import { SpotReservation } from '../../domain/entities/spot-reservation.entity';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { OrderIdSchemaType } from './types/order-id.schema-type';

export const PartnerSchema = new EntitySchema<Partner>({
  class: Partner,
  properties: {
    id: { primary: true, customType: new PartnerIdSchemaType() },
    name: { type: 'string', length: 255 },
  },
});

export const CustomerSchema = new EntitySchema<Customer>({
  class: Customer,
  uniques: [{ properties: ['cpf'] }],
  properties: {
    id: {
      customType: new CustomerIdSchemaType(),
      primary: true,
    },
    cpf: { customType: new CpfSchemaType() },
    name: { type: 'string', length: 255 },
  },
});

export const EventSchema = new EntitySchema<Event>({
  class: Event,
  properties: {
    id: {
      customType: new EventIdSchemaType(),
      primary: true,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    date: { type: 'date' },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    sections: {
      reference: '1:m',
      entity: () => EventSection,
      mappedBy: (section) => section.event_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    partner_id: {
      reference: 'm:1',
      entity: () => Partner,
      hidden: true,
      mapToPk: true,
      customType: new PartnerIdSchemaType(),
      inherited: true,
    },
  },
});

export const EventSectionSchema = new EntitySchema<EventSection>({
  class: EventSection,
  properties: {
    id: {
      customType: new EventSectionIdSchemaType(),
      primary: true,
    },
    name: { type: 'string', length: 255 },
    description: { type: 'text', nullable: true },
    is_published: { type: 'boolean', default: false },
    total_spots: { type: 'number', default: 0 },
    total_spots_reserved: { type: 'number', default: 0 },
    price: { type: 'number', default: 0 },
    spots: {
      reference: '1:m',
      entity: () => EventSpot,
      mappedBy: (section) => section.event_section_id,
      eager: true,
      cascade: [Cascade.ALL],
    },
    event_id: {
      reference: 'm:1',
      entity: () => Event,
      hidden: true,
      mapToPk: true,
      customType: new EventIdSchemaType(),
    },
  },
});

export const EventSpotSchema = new EntitySchema<EventSpot>({
  class: EventSpot,
  properties: {
    id: {
      customType: new EventSpotIdSchemaType(),
      primary: true,
    },
    location: { type: 'string', length: 255, nullable: true },
    is_reserved: { type: 'boolean', default: false },
    is_published: { type: 'boolean', default: false },
    event_section_id: {
      reference: 'm:1',
      entity: () => EventSection,
      hidden: true,
      mapToPk: true,
      customType: new EventSectionIdSchemaType(),
    },
  },
});

export const SpotReservationSchema = new EntitySchema<SpotReservation>({
  class: SpotReservation,
  properties: {
    spot_id: {
      customType: new EventSpotIdSchemaType(),
      primary: true,
      reference: 'm:1',
      entity: () => EventSpot,
      mapToPk: true,
    },
    reservation_date: { type: 'date' },
    customer_id: {
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
      customType: new CustomerIdSchemaType(),
    },
  },
});

export const OrderSchema = new EntitySchema<Order>({
  class: Order,
  properties: {
    id: {
      customType: new OrderIdSchemaType(),
      primary: true,
    },
    amount: { type: 'number' },
    status: { enum: true, items: () => OrderStatus },
    customer_id: {
      reference: 'm:1',
      entity: () => Customer,
      mapToPk: true,
      hidden: true,
      inherited: true,
      customType: new CustomerIdSchemaType(),
    },
    event_spot_id: {
      reference: 'm:1',
      entity: () => EventSpot,
      hidden: true,
      mapToPk: true,
      inherited: true,
      customType: new EventSpotIdSchemaType(),
    },
  },
});
