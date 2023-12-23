import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import { TypesenseService } from './typesense.service';

@Controller('typesense')
export class TypesenseController {
  constructor(private readonly typesenseService: TypesenseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBooks(@UploadedFile() file: Express.Multer.File) {
    //---------
    const filePath = path.join(process.cwd(), 'data', 'books.jsonl');
    const booksInJsonl = fs.readFileSync(filePath, 'utf-8');
    const booksData = booksInJsonl.split('\n');
    // Data pre processing
    const books = booksData.reduce((acc, line) => {
      if (line.trim() !== '') {
        try {
          const parsedLine = JSON.parse(line);
          acc.push(parsedLine);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
      return acc;
    }, []);

    return this.typesenseService.indexData(books);
  }
  @Get('/search/books')
  async searchBook(@Query() search: SearchParams) {
    console.log(search);
    let searchParameters = {
      q: '*',
      ...search,
    };
    return this.typesenseService.searchData(searchParameters);
  }
}
