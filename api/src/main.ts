import { NestFactory } from '@nestjs/core';
import { MessageModule } from './messages/messages.module';
import { ConfigService } from './services/config/config.service';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice(MessageModule, {
    transport: Transport.RMQ,
    options: {
      urls: [config.get('rabbitmq_dsn')],
      queue: 'messages_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  await app.listen();
}
bootstrap();
