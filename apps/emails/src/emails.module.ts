import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  imports: [],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
