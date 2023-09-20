import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { ConfigModule } from '../../config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '../../config/config.service';

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
    ])
  ],
  controllers: [],
  providers: [MessageGateway],
})
export class MessageModule { }