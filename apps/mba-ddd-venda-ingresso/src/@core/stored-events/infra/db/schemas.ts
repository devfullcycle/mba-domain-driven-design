import { EntitySchema } from '@mikro-orm/core';
import { StoredEvent } from '../../domain/entities/stored-event.entity';
import { StoredEventIdSchemaType } from './types/stored-event-id.schema-type';

export const StoredEventSchema = new EntitySchema<StoredEvent>({
  class: StoredEvent,
  properties: {
    id: {
      customType: new StoredEventIdSchemaType(),
      primary: true,
    },
    body: { type: 'json' },
    type_name: { type: 'string', length: 255 },
    occurred_on: { type: 'date' },
  },
});
