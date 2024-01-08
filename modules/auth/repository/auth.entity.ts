import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
  GUEST = 'guest',
}

@Entity({ name: 'Auth' })
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'isVerified', default: false })
  isVerified: boolean;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'special_token', type: 'string', default: null })
  special_token: string;
}
