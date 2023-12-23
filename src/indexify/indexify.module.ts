import { Module } from '@nestjs/common';
import { IndexifyController } from './indexify.controller';
import { IndexifyService } from './indexify.service';

@Module({
  controllers: [IndexifyController],
  providers: [IndexifyService],
})
export class IndexifyModule {}
