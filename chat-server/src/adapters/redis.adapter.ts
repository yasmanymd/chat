import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from 'socket.io-redis';
import { RedisClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number): any {
    const server = super.createIOServer(port, {
      cors: {
        origin: process.env.IO_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
        transports: ['websocket', 'polling'],
      },
      allowEIO3: true
    });
    const pubClient = new RedisClient({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });
    const subClient = pubClient.duplicate();
    const adapter = createAdapter({ pubClient, subClient });
    server.adapter(adapter);
    return server;
  }
}