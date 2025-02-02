import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], 
  controllers: [RolesController],
  providers: [RolesRepository],
  exports: [RolesRepository],
})
export class RolesModule {}
