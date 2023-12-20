import { Injectable } from '@nestjs/common';
import { iIndexing } from 'src/types';
import Typesense, { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';
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
  public async indexing({
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
  public async searchResult(
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

  /*=============================================
  =            Utils Privet method              =
  =============================================*/

  private async generateSchemaFromData(
    data: { [x: string]: any },
    collectionName: string,
  ) {
    if (typeof data !== 'object') {
      throw new Error('Invalid data format. Expected JSON object.');
    }

    //-> Schema structure
    const schema = {
      name: collectionName,
      fields: [],
      default_sorting_field: null,
    };

    //-> Loop Throw
    for (const key in data) {
      const value = data[key];
      let fieldType;

      if (Array.isArray(value)) {
      } else if (value.length > 0) {
        fieldType = 'string[]';
      } else if (typeof value === 'object') {
        fieldType = 'object';
      } else if (typeof value === 'string') {
        fieldType = 'string';
      } else if (typeof value === 'number') {
        fieldType = Number.isInteger(value) ? 'int32' : 'float';
      } else if (typeof value === 'boolean') {
        fieldType = 'bool';
      } else {
        fieldType = 'string';
      }

      schema.fields.push({
        name: key,
        type: fieldType,
      });
    }

    return schema;
  }
}
