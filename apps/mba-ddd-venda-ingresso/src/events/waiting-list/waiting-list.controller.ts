import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WaitingListService } from '../../@core/events/application/waiting-list.service';

@Controller('events/:event_id/sections/:section_id/waiting-list')
export class WaitingListController {
  constructor(private waitingListService: WaitingListService) {}

  @Post()
  async join(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
    @Body() body: { customer_id: string },
  ) {
    return this.waitingListService.joinWaitingList({
      event_id,
      section_id,
      customer_id: body.customer_id,
    });
  }

  @Get()
  async list(
    @Param('event_id') event_id: string,
    @Param('section_id') section_id: string,
  ) {
    return this.waitingListService.listWaitingList(event_id, section_id);
  }
}
