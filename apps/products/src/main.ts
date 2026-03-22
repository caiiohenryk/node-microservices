import { NestFactory } from '@nestjs/core';
import { ConsulService } from './consul/consul.service';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(0);

  const server = app.getHttpServer();
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine server address.');
  }
  const port = address.port;

  const consulService = app.get(ConsulService);
  await consulService.registerService(port);

  app.enableShutdownHooks();
}
bootstrap();