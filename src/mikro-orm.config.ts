import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
} from './@core/events/infra/db/schemas';

export default {
  entities: [
    PartnerSchema,
    CustomerSchema,
    EventSchema,
    EventSectionSchema,
    EventSpotSchema,
    OrderSchema,
    SpotReservationSchema,
  ],
  dbName: 'events',
  host: 'localhost',
  user: 'root',
  password: 'root',
  type: 'mysql',
};
