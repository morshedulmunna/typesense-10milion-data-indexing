import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const postgresConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'typesensdb',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js'],
  logging: true,
};
