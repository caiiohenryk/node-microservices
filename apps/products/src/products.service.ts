import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductCreateDto } from './shared/dto/product.create.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async findProductOrThrow(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async createProduct(createDto: ProductCreateDto) {
    return await this.prisma.product.create({
      data: createDto,
    });
  }

  async getProductById(productId: number) {
    return await this.findProductOrThrow(productId);
  }

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }
  
  async updateProduct(productId: number, updateDto: ProductCreateDto) {
    await this.findProductOrThrow(productId);

    return await this.prisma.product.update({
      where: { id: productId },
      data: updateDto,
    });
  }

  async deleteProduct(productId: number) {
    await this.findProductOrThrow(productId);

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully.' };
  }
}
