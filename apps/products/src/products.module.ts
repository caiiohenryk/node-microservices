import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConsulModule } from './consul/consul.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConsulModule, HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
