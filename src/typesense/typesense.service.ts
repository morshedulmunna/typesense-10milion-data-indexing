// typesense.service.ts

import { Injectable } from '@nestjs/common';
import typesenseConfig from 'src/config/typesense.config';
import booksSchema from 'src/schema/bookSchema';
import IndexingService from 'src/utils/indexing.service';
import { SearchParams } from 'typesense/lib/Typesense/Documents';

@Injectable()
export class TypesenseService {
  private readonly typesenseClient = typesenseConfig;
  private readonly typesense = new IndexingService(this.typesenseClient);

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
