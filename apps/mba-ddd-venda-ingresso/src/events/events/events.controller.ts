import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from '../../@core/events/application/event.service';
import { EventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private eventService: EventService) {}

  @Get()
  async list() {
    const events = await this.eventService.findEvents();
    logSizeInBytes('events', events[0]);
    return events;
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

const getSizeInBytes = (obj) => {
  let str = null;
  if (typeof obj === 'string') {
    // If obj is a string, then use it
    str = obj;
  } else {
    // Else, make obj into a string
    str = JSON.stringify(obj);
  }
  // Get the length of the Uint8Array
  const bytes = new TextEncoder().encode(str).length;
  return bytes;
};

const logSizeInBytes = (description, obj) => {
  const bytes = getSizeInBytes(obj);
  console.log(`${description} is approximately ${bytes} B`);
};
