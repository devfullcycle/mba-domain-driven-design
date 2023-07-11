import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from '../../@core/events/application/event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list() {
    return this.eventService.findEvents();
  }

  @Post()
  create(
    @Body()
    body: EventDto,
  ) {
    return this.eventService.create(body);
  }

  @Put(':event_id/publish-all')
  publish(@Param('event_id') event_id: string) {
    return this.eventService.publishAll({ event_id: event_id });
  }
}
