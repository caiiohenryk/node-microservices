import { Injectable } from '@nestjs/common';
import Consul = require('consul');

@Injectable()
export class ConsulService {
  private readonly consul;

  constructor() {
    this.consul = new Consul({
      host: process.env.CONSUL_HOST || 'localhost',
      port: Number(process.env.CONSUL_PORT || '8500'),
    });
  }

  async discoverService(
    serviceName: string,
  ): Promise<{ Address: string; Port: number } | null> {
    const services = await this.consul.health.service({
      service: serviceName,
      passing: true,
    });

    if (services.length === 0) {
      return null;
    }

    const serviceInstance =
      services[Math.floor(Math.random() * services.length)];

    if (!serviceInstance?.Service?.Address || !serviceInstance?.Service?.Port) {
      return null;
    }

    return serviceInstance.Service;
  }
}
