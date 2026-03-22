import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateOrderDTO } from './shared/dtos/order.request.dto';
import axios from 'axios';
import { PrismaService } from './prisma/prisma.service';
import { RequestProductDTO } from './shared/dtos/product.request.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly productsServiceBaseUrl =
    process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3000';

  private getProductUrl(productId: number): string {
    return `${this.productsServiceBaseUrl}/products/${productId}`;
  }

  private async fetchProduct(productId: number): Promise<RequestProductDTO> {
    const { data } = await axios.get<RequestProductDTO>(this.getProductUrl(productId));
    return data;
  }

  private async updateProductQuantity(productId: number, quantity: number): Promise<void> {
    await axios.put(this.getProductUrl(productId), { quantity });
  }

  async createOrder(orderDto: CreateOrderDTO) {
    try {
      const product = await this.fetchProduct(orderDto.productId);

      if (!product || product.quantity < orderDto.quantity) {
        throw new BadRequestException('Product not available in the requested quantity.');
      }

      const totalPrice = product.price * orderDto.quantity;
      const order = await this.prisma.order.create({
        data: {
          product_id: orderDto.productId,
          product_quantity: orderDto.quantity,
          total_price: totalPrice,
          shipping_adress: orderDto.shippingAddress,
          order_date: new Date(),
        },
      });

      await this.updateProductQuantity(
        orderDto.productId,
        product.quantity - orderDto.quantity,
      );

      return order;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const statusCode = (error as { response?: { status?: number } }).response
          ?.status;
        if (statusCode === 404) {
          throw new BadRequestException('Product not found.');
        }
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Error creating order: ${message}`);
    }
  }
}
