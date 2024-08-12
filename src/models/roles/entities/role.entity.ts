import { User } from 'src/models/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
// import { RolePermission } from '../../role-permissions/entities/role-permission.entity';
// import { EmployeeRole } from '../../employee-roles/entities/employee-role.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations to sync after LOL

  //   @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  //   permissions: RolePermission[];

  //   @OneToMany(() => EmployeeRole, (employeeRole) => employeeRole.role)
  //   employees: EmployeeRole[];

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];
}
