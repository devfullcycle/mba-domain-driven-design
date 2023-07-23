import { IDomainEvent } from '../../../../common/domain/domain-event';
import Cpf from '../../../../common/domain/value-objects/cpf.vo';
import { EventId } from '../../entities/event.entity';
import { PartnerId } from '../../entities/partner.entity';

export class EventCreated implements IDomainEvent {
  readonly event_version: number = 1;
  readonly occurred_on: Date;

  constructor(
    readonly aggregate_id: EventId,
    readonly name: string,
    readonly description: string | null,
    readonly date: Date,
    readonly is_published: boolean,
    readonly total_spots: number,
    readonly total_spots_reserved: number,
    readonly partner_id: PartnerId,
  ) {
    this.occurred_on = new Date();
  }
}
