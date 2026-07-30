import { Type } from '@mikro-orm/core';
import { WaitingListId } from '../../domain/entities/waiting-list.entity';

export class WaitingListIdSchemaType extends Type<WaitingListId, string> {
  convertToDatabaseValue(value: WaitingListId | undefined): string {
    return value instanceof WaitingListId ? value.value : (value as string);
  }

  convertToJSValue(value: string): WaitingListId {
    return new WaitingListId(value);
  }

  getColumnType() {
    return 'varchar(36)';
  }
}
