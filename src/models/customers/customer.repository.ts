import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import logger from 'winston.config';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<{ data: Customer }> {
    try {
      const newCustomer = this.entityManager.create(Customer, createCustomerDto);
      const savedCustomer = await this.entityManager.save(newCustomer);
      return { data: savedCustomer };
    } catch (error) {
      logger.error(`Failed to create customer: ${error.message}`);
      throw new InternalServerErrorException('Failed to create customer');
    }
  }

  async findAll(): Promise<{ data: Customer[] }> {
    try {
      const customers = await this.entityManager.find(Customer);
      return { data: customers };
    } catch (error) {
      logger.error(`Failed to retrieve customers: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve customers');
    }
  }

  async findOne(id: number): Promise<{ data: Customer }> {
    try {
      const customer = await this.entityManager.findOne(Customer, {
        where: { id },
      });
      if (!customer) {
        logger.warn(`Customer with ID ${id} not found`);
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return { data: customer };
    } catch (error) {
      logger.error(`Failed to retrieve customer with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to retrieve customer with ID ${id}`);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto): Promise<{ data: Customer }> {
    try {
      const customer = await this.entityManager.preload(Customer, {
        id,
        ...updateCustomerDto,
      });
      if (!customer) {
        logger.warn(`Customer with ID ${id} not found for update`);
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      const updatedCustomer = await this.entityManager.save(customer);
      return { data: updatedCustomer };
    } catch (error) {
      logger.error(`Failed to update customer with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to update customer with ID ${id}`);
    }
  }

  async remove(id: number): Promise<{ data: null }> {
    try {
      const customer = await this.findOne(id);
      await this.entityManager.remove(customer);
      return { data: null };
    } catch (error) {
      logger.error(`Failed to remove customer with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(`Failed to remove customer with ID ${id}`);
    }
  }
}
