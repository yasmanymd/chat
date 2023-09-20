import { Module } from '@nestjs/common';
import { MessageModule } from './message-events/message.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [MessageModule],
  controllers: [AppController, RoomController],
  providers: [AppService, RoomService],
})
export class AppModule { }
