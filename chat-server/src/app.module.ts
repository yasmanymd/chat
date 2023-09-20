import { Module } from '@nestjs/common';
import { MessageModule } from './message-events/message.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'MESSAGE_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('rabbitmq_dsn')],
              queue: 'messages_queue',
              queueOptions: {
                durable: false
              },
            }
          });
        },
        inject: [ConfigService]
      }
    ]),
    MessageModule],
  controllers: [AppController, RoomController],
  providers: [AppService, RoomService],
})
export class AppModule { }
