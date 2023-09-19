import { IRoom } from "../components/lobby";
import { Response } from "./response";

export async function getRooms(): Promise<Response<IRoom[]>> {
  const response = await fetch('/api/rooms');

  return await response.json();
}

export async function createRoom(room: IRoom): Promise<Response<IRoom>> {
  const response = await fetch(encodeURI('/api/rooms'), {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(room)
  });

  return await response.json();
}

