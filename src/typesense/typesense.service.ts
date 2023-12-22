import { Injectable } from '@nestjs/common';
import typesenseConfig from 'src/config/typesense.config';
import { Indexify } from 'src/indexify/indexify.service';
import booksSchema from 'src/schema/bookSchema';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

@Injectable()
export class TypesenseService {
  private readonly typesenseClient = typesenseConfig;
  private readonly typesense = new Indexify(this.typesenseClient);

  /**
   *
   * Index my Data
   *
   */
  async indexData(data: any): Promise<string> {
    try {
      return await this.typesense.indexing({
        data,
        schema: booksSchema,
        collection: 'booksCollection',
      });
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  /**
   *
   * getting Search Data
   *
   */
  async searchData(query: SearchParams): Promise<SearchResponse<object>> {
    try {
      return this.typesense.searchResult(query, 'booksCollection');
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
