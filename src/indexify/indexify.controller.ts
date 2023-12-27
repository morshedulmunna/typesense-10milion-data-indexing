import {
  Body,
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
import { bookDataDto } from './dto/documents.dto';

@Controller('indexify')
export class IndexifyController {
  // private readonly dataProcess = new DataProcess();
  constructor(private readonly indexifyService: IndexifyService) {}

  @Post('collection-create')
  @UseInterceptors()
  async createCollection() {
    return this.indexifyService.createCollection();
  }

  @Post('single-upload')
  @UseInterceptors()
  async SingleDocumentIndexing(@Body() documents: bookDataDto) {
    //@UploadedFile() file: Express.Multer.File
    // const data = await this.dataProcess.jsonlFileProcess('data', 'books.jsonl');

    return this.indexifyService.singleDocumentIndexing(documents);
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
