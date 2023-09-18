import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message-events/message.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessageModule,],
  controllers: [AppController, RoomController],
  providers: [AppService, RoomService],
})
export class AppModule { }
