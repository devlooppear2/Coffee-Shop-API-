import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import logger from 'winston.config';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<{ data: Role }> {
    try {
      const newRole = this.entityManager.create(Role, createRoleDto);
      const savedRole = await this.entityManager.save(Role, newRole);
      return { data: savedRole };
    } catch (error) {
      logger.error(`Failed to create role: ${error.message}`);
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async findAll(): Promise<{ data: Role[] }> {
    try {
      const roles = await this.entityManager.find(Role);
      return { data: roles };
    } catch (error) {
      logger.error(`Failed to retrieve roles: ${error.message}`);
      throw new InternalServerErrorException('Failed to retrieve roles');
    }
  }

  async findOne(id: number): Promise<{ data: Role }> {
    try {
      const role = await this.entityManager.findOne(Role, { where: { id } });
      if (!role) {
        logger.warn(`Role with ID ${id} not found`);
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return { data: role };
    } catch (error) {
      logger.error(`Failed to retrieve role with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to retrieve role with ID ${id}`,
      );
    }
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ data: Role }> {
    try {
      const role = await this.entityManager.preload(Role, {
        id,
        ...updateRoleDto,
      });
      if (!role) {
        logger.warn(`Role with ID ${id} not found for update`);
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      const updatedRole = await this.entityManager.save(Role, role);
      return { data: updatedRole };
    } catch (error) {
      logger.error(`Failed to update role with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to update role with ID ${id}`,
      );
    }
  }

  async remove(id: number): Promise<{ data: null }> {
    try {
      const role = await this.findOne(id);
      await this.entityManager.remove(Role, role.data);
      return { data: null };
    } catch (error) {
      logger.error(`Failed to remove role with ID ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to remove role with ID ${id}`,
      );
    }
  }
}
