import { NestFactory } from '@nestjs/core';
import { ConfigService } from './services/config/config.service';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.createMicroservice(AppModule, {
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
