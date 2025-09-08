import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConsulModule } from './consul/consul.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConsulModule, HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
