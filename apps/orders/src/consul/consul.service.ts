import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Consul = require('consul');
import { randomUUID } from 'crypto';

@Injectable()
export class ConsulService implements OnModuleDestroy {
  private readonly consul;
  private readonly serviceName = 'orders-service'; // <-- MUDA PARA CADA SERVIÇO
  private readonly instanceId = `${this.serviceName}-${randomUUID()}`;
  private instancePort: number;

  constructor() {
    this.consul = new Consul({ host: 'localhost', port: 8500 });
  }

  async registerService(port: number) {
    this.instancePort = port;
    const service = {
      id: this.instanceId,
      name: this.serviceName,
      port: this.instancePort,
      address: 'host.docker.internal',
      check: {
        http: `http://host.docker.internal:${this.instancePort}/orders/health`,
        interval: '10s',
        timeout: '5s',
      },
    };
    await this.consul.agent.service.register(service);
    console.log(`Instance ${this.instanceId} registered on port ${port}.`);
  }

  async onModuleDestroy() {
    console.log(`Deregistering instance: ${this.instanceId}`);
    await this.consul.agent.service.deregister(this.instanceId);
  }
}
