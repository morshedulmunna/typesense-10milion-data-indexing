import { Injectable } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import {
  CollectionCreateOptions,
  CollectionCreateSchema,
} from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
interface TypesenseConfig {
  any;
}

@Injectable()
export default class IndexingService {
  private readonly _indexingClient: Client;

  constructor(config: ConfigurationOptions) {
    this._indexingClient = new Typesense.Client(config);
  }

  //   indexing method
  async createIndexing(
    data: any,
    schema: CollectionCreateSchema,
    collection: string,
    options?: CollectionCreateOptions,
  ) {
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

  // Getting Search Results
  async searchResult(query: SearchParams, collection: string) {
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
