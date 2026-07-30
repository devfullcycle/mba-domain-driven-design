import { Type } from '@mikro-orm/core';
import { WaitingListEntryId } from '../../domain/entities/waiting-list.entity';

export class WaitingListEntryIdSchemaType extends Type<
  WaitingListEntryId,
  string
> {
  convertToDatabaseValue(value: WaitingListEntryId | undefined): string {
    return value instanceof WaitingListEntryId
      ? value.value
      : (value as string);
  }

  convertToJSValue(value: string): WaitingListEntryId {
    return new WaitingListEntryId(value);
  }

  getColumnType() {
    return 'varchar(36)';
  }
}
