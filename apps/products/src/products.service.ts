import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductCreateDto } from './shared/dto/product.create.dto';
import { ValidationException } from './shared/exceptions/validation.exception';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createDto: ProductCreateDto) {
    if (createDto.quantity < 0) throw new ValidationException('Quantity cannot be less than zero');
    return await this.prisma.product.create({
      data: createDto
    })
  }

  async getProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });
  if (product == null) throw new NotFoundException('Product not found.');
  return product;
  }

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }
  
  async updateProduct(productId: number, updateDto: ProductCreateDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId }
    });
    if (existingProduct == null) throw new NotFoundException('Product not found.');
    if (updateDto.quantity < 0) throw new ValidationException('Quantity cannot be less than zero');
    return await this.prisma.product.update({
      where: { id: productId },
      data: updateDto
    });
  }

  async deleteProduct(productId: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId }
    });
    if (existingProduct == null) throw new NotFoundException('Product not found.');
    await this.prisma.product.delete({
      where: { id: productId }
    });
    return { message: 'Product deleted successfully.' };
  }
}
