import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateOrderDTO } from './shared/dtos/order.request.dto';
import axios from 'axios';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(orderDto: CreateOrderDTO) {
  try {
    const {data: product} = await axios.get(`http://localhost:3000/products/${orderDto.productId}`);
    if (!product || product.quantity < orderDto.quantity) throw new BadRequestException('Product not available in the requested quantity.');
    const totalPrice = product.price * orderDto.quantity;
    const order = await this.prisma.order.create({
      data: {
        product_id: orderDto.productId,
        product_quantity: orderDto.quantity,
        total_price: totalPrice,
        shipping_adress: orderDto.shippingAddress,
        order_date: new Date(),
      }
    });
    await axios.put(`http://localhost:3000/products/${orderDto.productId}`, { quantity: product.quantity - orderDto.quantity });
    return order;
  } catch (error) {
    throw new BadRequestException('Error creating order: ' + error.message);
  }
  
  }

}
