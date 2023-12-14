import { Module } from '@nestjs/common';
import { ProductsService } from './middlewares/products.service';
import { ProductsController } from './middlewares/products.controller';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
