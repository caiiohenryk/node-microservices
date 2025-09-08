import { NestFactory } from '@nestjs/core';
import { ConsulService } from './consul/consul.service';
import { ProductsModule } from './products.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  await app.listen(0); // Inicia em porta randômica

  const server = app.getHttpServer();
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine server address.');
  }
  const port = address.port;

  const consulService = app.get(ConsulService);
  await consulService.registerService(port); // Registra no Consul

  app.enableShutdownHooks(); // Habilita o onModuleDestroy
}
bootstrap();