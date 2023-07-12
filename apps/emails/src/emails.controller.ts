import { Controller, Get } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Controller()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  getHello(): string {
    return this.emailsService.getHello();
  }
}
