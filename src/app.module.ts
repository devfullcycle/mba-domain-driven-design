import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
