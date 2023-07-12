import {
  CustomerSchema,
  EventSchema,
  EventSectionSchema,
  EventSpotSchema,
  OrderSchema,
  PartnerSchema,
  SpotReservationSchema,
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
    StoredEventSchema,
  ],
  dbName: 'events',
  host: 'localhost',
  user: 'root',
  password: 'root',
  type: 'mysql',
};
