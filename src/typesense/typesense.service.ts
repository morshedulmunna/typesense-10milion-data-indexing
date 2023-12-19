// typesense.service.ts

import { Injectable } from '@nestjs/common';
import booksSchema from 'src/schema/bookSchema';
import IndexingService from 'src/utils/indexing.service';
import { SearchParams } from 'typesense/lib/Typesense/Documents';

@Injectable()
export class TypesenseService {
  constructor(private readonly typesense: IndexingService) {}

  async indexData(data: any): Promise<any> {
    try {
      this.typesense.createIndexing(data, booksSchema, 'booksCollection');
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async searchData(query: SearchParams) {
    try {
      this.typesense.searchResult(query, 'booksCollection');
    } catch (error) {
      console.log(error);

      return error.message;
    }
  }
}
