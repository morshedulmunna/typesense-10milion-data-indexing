import { Injectable } from '@nestjs/common';
import typesenseConfig from 'src/config/typesense.config';
import booksSchema from 'src/schema/bookSchema';
import { TypesenseClient } from 'src/typesense/typesense';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

@Injectable()
export class IndexifyService {
  private readonly typesense = new TypesenseClient(
    typesenseConfig,
    booksSchema,
  );

  /**
   *
   * Index my Data
   *
   */
  async createCollection(): Promise<object> {
    try {
      return await this.typesense.createCollection();
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
  /**
   *
   * Index my Data
   *
   */
  async singleDocumentIndexing(data: object): Promise<object> {
    try {
      return await this.typesense.singleIndex(data, 'my-collection');
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
      return this.typesense.searchByQuery(query, 'my-collection');
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
