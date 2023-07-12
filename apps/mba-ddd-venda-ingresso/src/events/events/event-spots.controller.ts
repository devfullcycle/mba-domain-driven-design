import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { EventService } from '../../@core/events/application/event.service';

@Controller('events/:event_id/sections/:section_id/spots')
export class EventSpotsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
  ) {
    return this.eventService.findSpots({
      event_id: event_id,
      section_id: section_id,
    });
  }

  @Put(':spot_id')
  update(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
    @Param('spot_id') spot_id: string,
    @Body()
    body: {
      location: string;
    },
  ) {
    return this.eventService.updateLocation({
      ...body,
      event_id: event_id,
      section_id: section_id,
      spot_id: spot_id,
    });
  }
}
