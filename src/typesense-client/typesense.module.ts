import { Module } from '@nestjs/common';
import { TypesenseController } from './typesense.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [TypesenseController],
})
export class TypesenseModule {}
