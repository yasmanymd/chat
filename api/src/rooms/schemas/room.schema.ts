import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { IRoom } from '../interfaces/room.interface';

export type RoomDocument = Room & Document;

@Schema()
export class Room implements IRoom {
  _id: string;

  @Prop({ required: true })
  name: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);