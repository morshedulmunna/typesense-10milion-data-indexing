import { Injectable } from '@nestjs/common';
import { iIndexing } from 'src/types';
import Typesense, { Client } from 'typesense';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { IndexifyAbstract } from './indexify.abstract';

@Injectable()
export class Indexify implements IndexifyAbstract {
  private readonly _indexingClient: Client;

  constructor(config: ConfigurationOptions) {
    this._indexingClient = new Typesense.Client(config);
  }

  /**
   *
   * Indexing method
   *
   */

  async indexing({
    data,
    schema,
    collection,
    options,
  }: iIndexing): Promise<string> {
    try {
      await this._indexingClient.collections().create(schema, options);

      const result = await this._indexingClient
        .collections(collection)
        .documents()
        .import(data);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * Search method implement
   *
   */
  async searchResult(
    query: SearchParams,
    collection: string,
  ): Promise<SearchResponse<object>> {
    try {
      const searchResults = await this._indexingClient
        .collections(collection)
        .documents()
        .search(query);
      return searchResults;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
