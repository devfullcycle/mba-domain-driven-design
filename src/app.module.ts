import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { DomainEventsModule } from './domain-events/domain-events.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [DatabaseModule, EventsModule, DomainEventsModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
