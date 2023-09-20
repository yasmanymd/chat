import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './services/config/mongo-config.service';
import { Message, MessageSchema } from './messages/schemas/message.schema';
import { MessagesController } from './messages/messages.controller';
import { MessageService } from './messages/messages.service';
import { Room, RoomSchema } from './rooms/schemas/room.schema';
import { RoomsController } from './rooms/rooms.controller';
import { RoomService } from './rooms/rooms.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongoConfigService }),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [MessagesController, RoomsController],
  providers: [MessageService, RoomService],
})
export class AppModule { }