import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from '../services/config/mongo-config.service';
import { Room, RoomSchema } from './schemas/room.schema';
import { RoomsController } from './rooms.controller';
import { RoomService } from './rooms.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongoConfigService }),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }])
  ],
  controllers: [RoomsController],
  providers: [RoomService],
})
export class RoomModule { }