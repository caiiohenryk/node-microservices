import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module'; // ou OrdersModule, dependendo do nome
import { ConsulService } from './consul/consul.service';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  // É ESSENCIAL QUE ESSA LÓGICA ESTEJA AQUI
  await app.listen(0); // Inicia em porta randômica

  const server = app.getHttpServer();
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine server address.');
  }
  const port = address.port; // Captura a porta

  // Pega a instância do ConsulService e chama o registro
  const consulService = app.get(ConsulService);
  await consulService.registerService(port); // Registra no Consul

  app.enableShutdownHooks(); // Habilita o onModuleDestroy
}
bootstrap();