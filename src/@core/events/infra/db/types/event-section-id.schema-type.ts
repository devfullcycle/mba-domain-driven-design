import { Type, Platform, EntityProperty } from '@mikro-orm/core';
import { EventSectionId } from '../../../domain/entities/event-section';

export class EventSectionIdSchemaType extends Type<EventSectionId, string> {
  convertToDatabaseValue(
    valueObject: EventSectionId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventSectionId
      ? valueObject.value
      : (valueObject as string);
  }

  //não funciona para relacionamentos
  convertToJSValue(value: string, platform: Platform): EventSectionId {
    return new EventSectionId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `varchar(36)`;
  }
}
