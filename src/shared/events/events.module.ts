import { Global, Module } from '@nestjs/common';
import { EVENT_BUS } from 'src/modules/auction/domain/ports/tokens';
import { InMemoryEventBus } from 'src/shared/events/in-memory-event-bus';

@Global()
@Module({
  providers: [
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus,
    },
  ],
  exports: [EVENT_BUS],
})
export class EventsModule {}
