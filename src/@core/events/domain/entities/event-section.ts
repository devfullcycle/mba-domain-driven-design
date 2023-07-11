import { Entity } from '../../../common/domain/entity';
import {
  AnyCollection,
  ICollection,
  MyCollectionFactory,
} from '../../../common/domain/my-collection';
import Uuid from '../../../common/domain/value-objects/uuid.vo';
import { EventSpot, EventSpotId } from './event-spot';

export class EventSectionId extends Uuid {}

export type EventSectionCreateCommand = {
  name: string;
  description?: string | null;
  total_spots: number;
  price: number;
};

export type EventSectionConstructorProps = {
  id?: EventSectionId | string;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
};

export class EventSection extends Entity {
  id: EventSectionId;
  name: string;
  description: string | null;
  is_published: boolean;
  total_spots: number;
  total_spots_reserved: number;
  price: number;
  private _spots: ICollection<EventSpot>;

  constructor(props: EventSectionConstructorProps) {
    super();
    this.id =
      typeof props.id === 'string'
        ? new EventSectionId(props.id)
        : props.id ?? new EventSectionId();
    this.name = props.name;
    this.description = props.description;
    this.is_published = props.is_published;
    this.total_spots = props.total_spots;
    this.total_spots_reserved = props.total_spots_reserved;
    this.price = props.price;
    this._spots = MyCollectionFactory.create<EventSpot>(this);
  }

  static create(command: EventSectionCreateCommand) {
    const section = new EventSection({
      ...command,
      description: command.description ?? null,
      is_published: false,
      total_spots_reserved: 0,
    });

    section.initSpots();
    return section;
  }

  private initSpots() {
    for (let i = 0; i < this.total_spots; i++) {
      this.spots.add(EventSpot.create());
    }
  }

  changeName(name: string) {
    this.name = name;
  }

  changeDescription(description: string | null) {
    this.description = description;
  }

  changePrice(price: number) {
    this.price = price;
  }

  changeLocation(command: { spot_id: EventSpotId; location: string }) {
    const spot = this.spots.find((spot) => spot.id.equals(command.spot_id));
    if (!spot) {
      throw new Error('Spot not found');
    }
    spot.changeLocation(command.location);
  }

  publishAll() {
    this.publish();
    this.spots.forEach((spot) => spot.publish());
  }

  publish() {
    this.is_published = true;
  }

  unPublish() {
    this.is_published = false;
  }

  allowReserveSpot(spot_id: EventSpotId) {
    if (!this.is_published) {
      return false;
    }

    const spot = this.spots.find((spot) => spot.id.equals(spot_id));

    if (!spot) {
      throw new Error('Spot not found');
    }

    if (spot.is_reserved) {
      return false;
    }

    if (!spot.is_published) {
      return false;
    }

    return true;
  }

  markSpotAsReserved(spot_id: EventSpotId) {
    const spot = this.spots.find((spot) => spot.id.equals(spot_id));
    if (!spot) {
      throw new Error('Spot not found');
    }
    if (spot.is_reserved) {
      throw new Error('Spot already reserved');
    }
    spot.markAsReserved();
  }

  get spots(): ICollection<EventSpot> {
    return this._spots as ICollection<EventSpot>;
  }

  set spots(spots: AnyCollection<EventSpot>) {
    this._spots = MyCollectionFactory.createFrom<EventSpot>(spots);
  }

  toJSON() {
    return {
      id: this.id.value,
      name: this.name,
      description: this.description,
      is_published: this.is_published,
      total_spots: this.total_spots,
      total_spots_reserved: this.total_spots_reserved,
      price: this.price,
      spots: [...this.spots].map((spot) => spot.toJSON()),
    };
  }
}
