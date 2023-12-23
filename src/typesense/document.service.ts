import { Injectable } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import {
  DocumentImportParameters,
  ImportResponse,
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';
import { DocumentAbstract } from './document.abstract';

@Injectable()
export class Indexify implements DocumentAbstract {
  private readonly _indexingClient: Client;

  constructor(config: ConfigurationOptions) {
    this._indexingClient = new Typesense.Client(config);
  }

  /**
   *
   * Multiple Document Insert
   *
   */
  public async batchIndex(
    document: object[],
    collection: string,
    options?: DocumentImportParameters,
  ): Promise<ImportResponse[]> {
    try {
      // await this._indexingClient.collections().create(schema, options);

      return await this._indexingClient
        .collections(collection)
        .documents()
        .import(document, options); //
    } catch (error) {
      console.log(error);

      throw new Error(error.message);
    }
  }

  /**
   *
   * Single Document Insert
   *
   */

  public async singleIndex(
    document: object,
    collection: string,
  ): Promise<object> {
    try {
      return await this._indexingClient
        .collections(collection)
        .documents()
        .create(document);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * Update Single Document
   *We can update a single document from a collection by using its id. The update can be partial,
   */
  public async singleUpdate(
    document: object,
    id: string,
    collection: string,
  ): Promise<object> {
    try {
      return await this._indexingClient
        .collections(collection)
        .documents(id)
        .update(document);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  /**
   *
   * Update  Document by query
   *To update all documents that match a given filter_by query:
   */
  public async updateByQuery(
    document: object,
    collection: string,
    query: string, //'num_employees:>1000'
  ): Promise<object> {
    try {
      return await this._indexingClient
        .collections(collection)
        .documents()
        .update(document, { filter_by: query });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * delete Single Document
   *We can delete a single document from a collection by using its id. The update can be partial,
   */
  public async singleDelete(id: string, collection: string): Promise<object> {
    try {
      return await this._indexingClient
        .collections(collection)
        .documents(id)
        .delete();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   *
   * Update  Document by query
   *To update all documents that match a given filter_by query:
   */
  public async deleteByQuery(
    document: object,
    collection: string,
    query: string, //'num_employees:>1000'
  ): Promise<object> {
    try {
      return await this._indexingClient
        .collections(collection)
        .documents()
        .delete({ filter_by: query });
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
  =             Privet method              =
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
