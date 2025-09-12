import { NestFactory } from '@nestjs/core';
import { ConsulService } from './consul/consul.service';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  await app.listen(0); // Inicia em porta randômica

  const server = app.getHttpServer();
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine server address.');
  }
  const port = address.port;
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const consulService = app.get(ConsulService);
  await consulService.registerService(port); // Registra no Consul

  app.enableShutdownHooks(); // Habilita o onModuleDestroy
}
bootstrap();