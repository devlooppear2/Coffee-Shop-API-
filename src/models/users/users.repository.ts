import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import logger from 'winston.config'; 

@Injectable()
export class UsersRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ data: User }> {
    try {
      const newUser = this.entityManager.create(User, createUserDto);
      const savedUser = await this.entityManager.save(User, newUser);
      return { data: savedUser };
    } catch (error) {
      logger.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<{ data: User[] }> {
    try {
      const users = await this.entityManager.find(User);
      return { data: users };
    } catch (error) {
      logger.error(`Failed to retrieve users: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: number): Promise<{ data: User }> {
    try {
      const user = await this.entityManager.findOne(User, { where: { id } });
      if (!user) {
        logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { data: user };
    } catch (error) {
      logger.error(`Failed to retrieve user with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to retrieve user with ID ${id}`,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ data: User }> {
    try {
      const user = await this.entityManager.preload(User, {
        id,
        ...updateUserDto,
      });
      if (!user) {
        logger.warn(`User with ID ${id} not found for update`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const updatedUser = await this.entityManager.save(User, user);
      return { data: updatedUser };
    } catch (error) {
      logger.error(`Failed to update user with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to update user with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<{ data: null }> {
    try {
      const user = await this.findOne(id);
      await this.entityManager.remove(User, user.data);
      return { data: null };
    } catch (error) {
      logger.error(`Failed to remove user with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to remove user with ID ${id}`,
      );
    }
  }
}
