import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConsulModule } from './consul/consul.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConsulModule, HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./apps/products/.env`,
    })
  ],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
