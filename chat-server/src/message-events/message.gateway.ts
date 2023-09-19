import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';

@WebSocketGateway({ namespace: '/chat' })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  private state: {
    connections: { [key: string]: { email: string, room: string } }
  } = {
      connections: {}
    };

  @SubscribeMessage('auth')
  public auth(client: Socket, payload: { email: string }) {
    this.logger.log(`Registering ${payload.email} with ${client.id}`);
    this.state.connections[client.id] = { email: payload.email, room: '' };
    this.logger.log(`Status of connections: `);
    this.logger.log(this.state.connections);
  }

  @SubscribeMessage('move')
  public handleMove(client: Socket, payload: { leaving?: string, joining?: string }) {
    const email = this.state.connections[client.id].email;
    if (payload.leaving) {
      this.logger.log(`User ${email} leaving room ${payload.leaving}`);
      client.leave(payload.leaving);
      this.state.connections[client.id].room = '';
      this.logger.log(`Notifying ${email} is leaving to room ${payload.leaving}`);
      client.to(payload.leaving).emit('userout', { email });
    }
    if (payload.joining) {
      this.logger.log(`User ${email} joining room ${payload.joining}`);
      client.join(payload.joining);
      this.state.connections[client.id].room = payload.joining;

      const clients = this.server.adapter.rooms.get(payload.joining);
      const participants = [];
      for (const clientId of clients) {
        if (clientId !== client.id) {
          participants.push(this.state.connections[clientId].email);
        }
      }

      this.logger.log(`Sendind participants ${participants} to user ${email}`);
      client.emit('participants', { participants: participants });
      this.logger.log(`Notifying user ${email} is joining to room ${payload.joining}`);
      client.to(payload.joining).emit('userin', { email });
    }
  }

  @SubscribeMessage('msg')
  public handleMessage(client: Socket, payload: { room: string, message: string }): Promise<WsResponse<any>> {
    const email = this.state.connections[client.id].email;
    this.logger.log(`User ${email} sending message to room ${payload.room}`);
    return this.server.to(payload.room).emit('msgToRoom', { email, message: payload.message, time: new Date() });
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    if (this.state.connections[client.id]) {
      const email = this.state.connections[client.id].email;
      this.logger.log(`Disconnecting ${email}`);
      const room = this.state.connections[client.id].room;
      this.logger.log(`Notifying ${email} is leaving to room ${room}`);
      client.to(room).emit('userout', { email });
      this.logger.log(`User ${email} has no room`);
      this.state.connections[client.id].room = '';
      delete this.state.connections[client.id];
    }

    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}