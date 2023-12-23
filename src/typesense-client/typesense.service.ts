import { Injectable } from '@nestjs/common';
import typesenseConfig from 'src/config/typesense.config';
import booksSchema from 'src/schema/bookSchema';
import { TypesenseClient } from 'src/typesense/typesense';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

@Injectable()
export class TypesenseService {
  private readonly config = typesenseConfig;
  private readonly typesense = new TypesenseClient(this.config, booksSchema);

  /**
   *
   * Index my Data
   *
   */
  async indexData(data: object[]): Promise<object> {
    try {
      // return await this.typesense.batchIndex(data, 'booksCollection', {
      //   action: 'upsert',
      // });
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
      // return this.typesense.searchResult(query, 'booksCollection');
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
