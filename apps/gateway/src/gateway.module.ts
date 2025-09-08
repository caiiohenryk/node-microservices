import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { ConsulModule } from './consul/consul.module';

@Module({
  imports: [HttpModule.register({ timeout: 5000 }), ConsulModule ],
  controllers: [GatewayController],
})
export class GatewayModule {}
