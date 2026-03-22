import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './shared/dto/product.create.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('health')
  async checkHealth() {
    return { status: 'ok' };
  }

  @Post()
  async create(@Body() createDto: ProductCreateDto) {
    return this.productsService.createProduct(createDto);
  }

  @Get()
  findAll() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: ProductCreateDto) {
    return this.productsService.updateProduct(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
