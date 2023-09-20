import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IRoom } from "./interfaces/room.interface";
import { RoomDocument } from "./schemas/room.schema";

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<RoomDocument>) { }

  public async createRoom(room: IRoom): Promise<IRoom> {
    const roomModel = new this.roomModel(room);
    return await roomModel.save();
  }

  public async getRooms(): Promise<IRoom[]> {
    return this.roomModel.find().exec();
  }
}