import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
  GUEST = 'guest',
}

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsOptional()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole, // Use the enum here
    default: UserRole.USER, // Set a default value
  })
  role: UserRole;

  @Column({ nullable: true })
  @IsOptional()
  special_token: string | null;
}
