import { Module } from '@nestjs/common';
import { TypesenseClient } from 'src/typesense/typesense';
import { TypesenseController } from './typesense.controller';
import { TypesenseService } from './typesense.service';

@Module({
  imports: [],
  providers: [TypesenseClient, TypesenseService],
  controllers: [TypesenseController],
})
export class TypesenseModule {}
