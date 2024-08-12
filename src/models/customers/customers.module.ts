import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersRepository } from './customer.repository';

@Module({
  controllers: [CustomersController],
  providers: [CustomersRepository],
})
export class CustomersModule {}
