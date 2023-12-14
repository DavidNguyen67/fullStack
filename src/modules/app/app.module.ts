import { Module } from '@nestjs/common';
import { AppController } from './middleware/app.controller';
import { AppService } from './middleware/app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsModule } from '../events/events.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
    }),
    EventsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
