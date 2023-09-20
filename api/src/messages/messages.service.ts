import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IMessage } from "./interfaces/message.interface";
import { MessageDocument } from "./schemas/message.schema";

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private readonly messageModel: Model<MessageDocument>) { }

  public async createMessage(message: IMessage): Promise<IMessage> {
    const messageModel = new this.messageModel(message);
    return await messageModel.save();
  }

  public async getMessagesByRoom(room: string): Promise<IMessage[]> {
    return this.messageModel.find({ room: room }).exec();
  }
}