import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './shared/dtos/order.request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }

  @Get('test')
  async test() {
    return { message: 'Products service is healthy' }
  }

  @Post()
  async create(@Body() createDto: CreateOrderDTO) {
    return this.ordersService.createOrder(createDto);
  }
}
