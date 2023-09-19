import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";
import { IMessage } from '../interfaces/message.interface';

export type MessageDocument = Message & Document;

@Schema()
export class Message implements IMessage {
  _id: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  room: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  time: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);