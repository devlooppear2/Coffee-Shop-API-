import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './models/users/users.module';
import { CustomersModule } from './models/customers/customers.module';
import { Customer } from './models/customers/entities/customer.entity';
import { User } from './models/users/entities/user.entity'; 
import { Role } from './models/roles/entities/role.entity'; 
import { RolesModule } from './models/roles/roles.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      schema: process.env.DB_SCHEMA,
      entities: [Customer, User, Role],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Customer, User, Role]),
    CustomersModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
