import { Injectable } from '@nestjs/common';
import { ErrorException } from 'src/libs/errors.exception';
import Typesense, { Client } from 'typesense';
import {
  CollectionSchema,
  CollectionUpdateSchema,
} from 'typesense/lib/Typesense/Collection';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import {
  DocumentImportParameters,
  ImportResponse,
} from 'typesense/lib/Typesense/Documents';
import { TypesenseUtils } from './utils/utils';

@Injectable()
export class TypesenseClient {
  private readonly default_schema: CollectionCreateSchema;
  private readonly client: Client;
  protected readonly schemaName: string;
  private utils: TypesenseUtils;

  constructor(config: ConfigurationOptions, schema: CollectionCreateSchema) {
    this.client = new Typesense.Client(config);
    this.default_schema = schema;
    this.schemaName = this.default_schema.name;
    this.utils = new TypesenseUtils(config, schema);
  }

  /*=============================================
  =            Collection related Methods       =
  =============================================*/

  /**
   * Creates a new collection with an optional schema parameter.
   * If no schema is provided, the method uses the default schema,
   * which is the object instance schema.
   * @param schema - (Optional) The schema defining the structure of the collection.
   *                Defaults to the object instance schema if not provided.
   * @returns Promise<CollectionSchema> A Promise that resolves to the schema of the collection.
   * Reference : https://typesense.org/docs/0.25.1/api/collections.html#with-pre-defined-schema
   */
  public createCollection(
    schema?: CollectionCreateSchema,
  ): Promise<CollectionSchema> {
    try {
      // -> Exception Handle Schema Already created or not
      this.utils.isSchemaExist(schema.name);

      if (!schema) {
        //-> If no schema provided, create a collection using the default schema
        return this.client.collections().create(this.default_schema);
      } else {
        //-> Create a collection using the provided schema
        return this.client.collections().create(schema);
      }
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Retrieves either a single collection or multiple collections based on the provided name.
   * @param collectionName - (Optional) The name of the collection to retrieve.
   *                        If not provided, retrieves all collections.
   * @returns Promise<CollectionSchema> | Promise<CollectionSchema[]> A Promise that resolves to either:
   *            - The schema of a single retrieved collection if collectionName is provided.
   *            - An array of schemas representing all collections if collectionName is not provided.
   * Reference: https://typesense.org/docs/0.25.1/api/collections.html#retrieve-a-collection
   */
  public retrieveCollection(
    collectionName?: string,
  ): Promise<CollectionSchema> | Promise<CollectionSchema[]> {
    try {
      if (!collectionName) {
        // Retrieve all collections if no collectionName is specified
        return this.client.collections().retrieve();
      } else {
        // Retrieve a specific collection based on the provided name
        return this.client.collections(collectionName).retrieve();
      }
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Retrieves the schema of a single collection based on the provided name,
   * or retrieves the schema of a default collection if no name is provided.
   * @param collectionName - (Optional) The name of the collection to retrieve.
   *                        If not provided, retrieves the default collection schema.
   * @returns A Promise that resolves to the schema of the specified or default collection.
   * Reference: https://typesense.org/docs/0.25.1/api/collections.html#retrieve-a-collection
   */
  public retrieveSingleCollection(
    collectionName?: string,
  ): Promise<CollectionSchema> {
    try {
      if (collectionName) {
        // Retrieve the schema of the specified collection
        return this.client.collections(collectionName).retrieve();
      } else {
        // Retrieve the schema of the default collection (this.schemaName)
        return this.client.collections(this.schemaName).retrieve();
      }
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Deletes a specific collection based on the provided name.
   * @param collectionName - The name of the collection to delete. if no collection name by default collection name point to the default schema name.
   * @returns A Promise that resolves when the specified collection is successfully deleted.
   * reference: https://typesense.org/docs/0.25.1/api/collections.html#drop-a-collection
   */
  public dropCollection(collectionName?: string): Promise<CollectionSchema> {
    try {
      if (collectionName) {
        return this.client.collections(collectionName).delete();
      } else {
        return this.client.collections(this.schemaName).delete();
      }
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Updates the schema of a specific collection identified by its name.
   * @param collectionName - The name of the collection to update.
   * @param update_schema - The updated schema to apply to the collection.
   * @returns A Promise that resolves to the updated schema of the collection.
   * reference: https://typesense.org/docs/0.25.1/api/collections.html#update-or-alter-a-collection
   * ------- Schema Demo-------------
   * update_schema = {
  "   fields":[
       {"name":"num_employees", "drop": true},
      {"name":"company_category", "type":"string"}
     ]
    }
   */
  public async updateCollection(
    collectionName: string,
    update_schema: CollectionUpdateSchema,
  ): Promise<CollectionSchema> {
    try {
      // -> Exception Handle Schema Already exist or not
      await this.utils.isSchemaExist(collectionName);

      return await this.client
        .collections(collectionName)
        .update(update_schema);
    } catch (error) {
      throw new ErrorException(error);
    }
  }
  /*=====  End of Collection related Methods  ======*/

  /*=============================================================
  =            Indexing  methods               =
  ==============================================================*/
  /**
   * Imports an array of documents into a specified collection or the default collection in batches.
   * @param document - An array of objects representing the documents to import.
   * @param collection - (Optional) The name of the collection where the documents will be imported.
   *                     If not provided, the documents are imported into the default collection.
   * @param options - (Optional) Additional parameters for the document import.
   * @returns A Promise that resolves to an array of ImportResponse containing import details.
   * @throws ErrorException - Throws an error exception if the document import encounters an error.
   */
  public async batchIndex(
    document: object[],
    collection?: string,
    options?: DocumentImportParameters,
  ): Promise<ImportResponse[]> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents()
        .import(document, options);
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Creates a single document within a specified collection or the default collection.
   * @param document - The object representing the document to create.
   * @param collection - (Optional) The name of the collection to add the document to.
   *                     If not provided, the document is added to the default collection.
   * @returns A Promise that resolves to the created document object.
   * @throws Error - Throws an error if document creation fails.
   */
  public async singleIndex(
    document: object,
    collection?: string,
  ): Promise<object> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents()
        .create(document);
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  public async updateById(
    document: object,
    id: string,
    collection?: string,
  ): Promise<object> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents(id)
        .update(document);
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Updates documents in a specified collection or the default collection based on a given query.
   * @param document - The object representing the updates to apply to matching documents.
   * @param collection - The name of the collection where the documents will be updated.
   * @param query - The query string to filter documents for updating.
   * @returns A Promise that resolves to an object representing the result of the update operation.
   * @throws ErrorException - Throws an error exception if the update operation encounters an error.
   */
  public async updateByQuery(
    document: object,
    collection: string,
    query: string, // e.g., 'num_employees:>1000'
  ): Promise<object> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents()
        .update(document, { filter_by: query });
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Deletes a single document by its ID from a specified collection or the default collection.
   * @param id - The ID of the document to delete.
   * @param collection - (Optional) The name of the collection from which to delete the document.
   *                     If not provided, the document is deleted from the default collection.
   * @returns A Promise that resolves to an object representing the result of the delete operation.
   * @throws ErrorException - Throws an error exception if the delete operation encounters an error.
   */
  public async deleteById(id: string, collection?: string): Promise<object> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents(id)
        .delete();
    } catch (error) {
      throw new ErrorException(error);
    }
  }

  /**
   * Deletes documents in a specified collection or the default collection based on a given query.
   * @param collection - The name of the collection from which documents will be deleted.
   * @param query - The query string to filter documents for deletion.
   * @returns A Promise that resolves to an object representing the result of the delete operation.
   * @throws ErrorException - Throws an error exception if the delete operation encounters an error.
   */
  public async deleteByQuery(
    collection: string,
    query: string, // e.g., 'num_employees:>1000'
  ): Promise<object> {
    try {
      return await this.client
        .collections(collection || this.schemaName)
        .documents()
        .delete({ filter_by: query });
    } catch (error) {
      throw new ErrorException(error);
    }
  }
  /*=======  End of Indexing  methods  =======*/

  //TODO: working on indexing the document
}
