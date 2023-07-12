import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { StoredEventId } from '../../../domain/entities/stored-event.entity';

export class StoredEventIdSchemaType extends Type<StoredEventId, string> {
  convertToDatabaseValue(
    valueObject: StoredEventId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof StoredEventId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): StoredEventId {
    return new StoredEventId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(255)`;
  }
}
