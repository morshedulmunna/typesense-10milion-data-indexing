import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import { DataProcess } from './../libs/process-jsonl';
import { IndexifyService } from './indexify.service';

@Controller('indexify')
export class IndexifyController {
  private readonly dataProcess = new DataProcess();
  constructor(private readonly indexifyService: IndexifyService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBooks(@UploadedFile() file: Express.Multer.File) {
    const data = await this.dataProcess.jsonlFileProcess('data', 'books.jsonl');
    return this.indexifyService.indexData(data);
  }

  @Get('/search/books')
  async searchBook(@Query() search: SearchParams) {
    let searchParameters = {
      q: '*',
      ...search,
    };
    return this.indexifyService.searchData(searchParameters);
  }
}
