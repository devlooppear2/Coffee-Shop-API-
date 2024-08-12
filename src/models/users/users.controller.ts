import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const result = await this.usersRepository.create(createUserDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.usersRepository.findAll();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new InternalServerErrorException('Failed to retrieve users:' + error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.usersRepository.findOne(+id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error(`Error retrieving user with ID ${id}:`, error);
      throw new InternalServerErrorException(`Failed to retrieve user with ID ${id}`);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.usersRepository.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new InternalServerErrorException(`Failed to update user with ID ${id}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.usersRepository.remove(+id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error(`Error removing user with ID ${id}:`, error);
      throw new InternalServerErrorException(`Failed to remove user with ID ${id}`);
    }
  }
}
