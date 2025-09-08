import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConsulModule } from './consul/consul.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConsulModule, HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
