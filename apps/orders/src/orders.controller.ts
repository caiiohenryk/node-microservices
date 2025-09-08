import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }

  @Get('test')
  async test() {
    return { message: 'Funcionando!' }
  }
}
