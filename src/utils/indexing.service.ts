import { Injectable } from '@nestjs/common';
import Typesense from 'typesense';
import { SearchParams } from 'typesense/lib/Typesense/Documents';

@Injectable()
export default class IndexingService {
  private readonly _indexingClient: any;

  constructor() {
    this._indexingClient = new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST,
          port: parseInt(process.env.TYPESENSE_PORT),
          protocol: process.env.TYPESENSE_PROTOCOL,
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY,
      connectionTimeoutSeconds: parseInt(
        process.env.TYPESENSE_CONNECTION_TIMEOUT,
      ),
    });
  }

  //   indexing method
  async createIndexing(data: any, schema: any, collection: string) {
    try {
      await this._indexingClient.collections().create(schema);

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
