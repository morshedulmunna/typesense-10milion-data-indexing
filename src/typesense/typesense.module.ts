import { Module } from '@nestjs/common';
import { TypesenseController } from './typesense.controller';
import { TypesenseService } from './typesense.service';

@Module({
  imports: [],
  providers: [TypesenseService],
  controllers: [TypesenseController],
})
export class TypesenseModule {}
