import { AggregateRoot } from '../../../common/domain/aggregate-root';
import { PartnerId } from './partner.entity';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { EventSection, EventSectionId } from './event-section';
import {
  AnyCollection,
  ICollection,
  MyCollectionFactory,
} from '../../../common/domain/my-collection';
import { EventSpotId } from './event-spot';
import { EventCreated } from '../events/domain-events/event-created.event';
import { EventChangedName } from '../events/domain-events/event-changed-name.event';
import { EventChangedDescription } from '../events/domain-events/event-changed-description.event';
import { EventChangedDate } from '../events/domain-events/event-changed-date.event';
import { EventPublishAll } from '../events/domain-events/event-publish-all.event';
import { EventPublish } from '../events/domain-events/event-publish.event';
import { EventUnpublish } from '../events/domain-events/event-unpublish.event';
import { EventAddedSection } from '../events/domain-events/event-added-section.event';
import { EventChangedSectionSection } from '../events/domain-events/event-changed-section-information.event';
import { EventChangedSpotLocation } from '../events/domain-events/event-changed-spot-location.event';
import { EventMarkedSportAsReserved } from '../events/domain-events/event-marked-sport-as-reserved.event';

export class EventId extends Uuid {}

export type CreateEventCommand = {
  name: string;
  description?: string | null;
  date: Date;
  partner_id: PartnerId;
};

export type AddSectionCommand = {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
};

export type EventConstructorProps = {
  id?: EventId | string;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId | string;
};

export class Event extends AggregateRoot {
  id: EventId;
  name: string;
  description: string | null;
  date: Date;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  partner_id: PartnerId;
  private _sections: ICollection<EventSection>;

  constructor(props: EventConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventId(props.id)
        : props.id ?? new EventId();

    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.partner_id =
      props.partner_id instanceof PartnerId
        ? props.partner_id
        : new PartnerId(props.partner_id);
    this._sections = MyCollectionFactory.create<EventSection>(this);
  }

  static create(command: CreateEventCommand) {
    const event = new Event({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots: 0,
      total_spots_reserved: 0,
    });
    event.addEvent(
      new EventCreated(
        event.id,
        event.name,
        event.description,
        event.date,
        event.is_published,
        event.total_spots,
        event.total_spots_reserved,
        event.partner_id,
      ),
    );
    return event;
  }

  changeName(name: string) {
    this.name = name;
    this.addEvent(new EventChangedName(this.id, this.name));
  }

  changeDescription(description: string | null) {
    this.description = description;
    this.addEvent(new EventChangedDescription(this.id, this.description));
  }

  changeDate(date: Date) {
    this.date = date;
    this.addEvent(new EventChangedDate(this.id, this.date));
  }

  publishAll() {
    this.publish();
    this._sections.forEach((section) => section.publishAll());
    this.addEvent(
      new EventPublishAll(
        this.id,
        this._sections.map((s) => s.id),
      ),
    );
  }

  publish() {
    this.is_published = true;
    this.addEvent(new EventPublish(this.id));
  }

  unPublish() {
    this.is_published = false;
    this.addEvent(new EventUnpublish(this.id));
  }

  addSection(command: AddSectionCommand) {
    const section = EventSection.create(command);
    this._sections.add(section);
    this.total_spots += section.total_spots;
    this.addEvent(
      new EventAddedSection(
        this.id,
        section.name,
        section.description,
        section.total_spots,
        section.price,
        this.total_spots,
      ),
    );
  }

  changeSectionInformation(command: {
    section_id: EventSectionId;
    name?: string;
    description?: string | null;
  }) {
    const section = this.sections.find((section) =>
      section.id.equals(command.section_id),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    'name' in command && section.changeName(command.name);
    'description' in command && section.changeDescription(command.description);
    this.addEvent(
      new EventChangedSectionSection(
        this.id,
        section.id,
        section.name,
        section.description,
      ),
    );
  }

  changeLocation(command: {
    section_id: EventSectionId;
    spot_id: EventSpotId;
    location: string;
  }) {
    const section = this.sections.find((section) =>
      section.id.equals(command.section_id),
    );
    if (!section) {
      throw new Error('Section not found');
    }
    section.changeLocation(command);
    this.addEvent(
      new EventChangedSpotLocation(
        this.id,
        section.id,
        command.spot_id,
        command.location,
      ),
    );
  }

  allowReserveSpot(data: { section_id: EventSectionId; spot_id: EventSpotId }) {
    if (!this.is_published) {
      return false;
    }

    const section = this.sections.find((s) => s.id.equals(data.section_id));
    if (!section) {
      throw new Error('Section not found');
    }

    return section.allowReserveSpot(data.spot_id);
  }

  markSpotAsReserved(command: {
    section_id: EventSectionId;
    spot_id: EventSpotId;
  }) {
    const section = this.sections.find((s) => s.id.equals(command.section_id));

    if (!section) {
      throw new Error('Section not found');
    }

    section.markSpotAsReserved(command.spot_id);
    this.addEvent(
      new EventMarkedSportAsReserved(this.id, section.id, command.spot_id),
    );
  }

  get sections(): ICollection<EventSection> {
    return this._sections as ICollection<EventSection>;
  }

  set sections(sections: AnyCollection<EventSection>) {
    this._sections = MyCollectionFactory.createFrom<EventSection>(sections);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      date: this.date,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      partner_id: this.partner_id.value,
      sections: [...this._sections].map((section) => section.toJSON()),
    };
  }
}
