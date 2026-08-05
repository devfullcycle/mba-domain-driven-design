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
} from './@core/events/infra/db/schemas';
import { StoredEventSchema } from './@core/stored-events/infra/db/schemas';

export default {
  entities: [
    PartnerSchema,
    CustomerSchema,
    EventSchema,
    EventSectionSchema,
    EventSpotSchema,
    OrderSchema,
    SpotReservationSchema,
    WaitingListSchema,
    WaitingListEntrySchema,
    StoredEventSchema,
  ],
  dbName: 'events',
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  type: 'mysql',
};
