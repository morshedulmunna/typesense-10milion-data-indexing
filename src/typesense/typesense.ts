import { Injectable } from '@nestjs/common';
import Typesense, { Client } from 'typesense';
import {
  CollectionSchema,
  CollectionUpdateSchema,
} from 'typesense/lib/Typesense/Collection';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { TypesenseUtils } from './utils/utils';

@Injectable()
export class TypesenseClient {
  private readonly default_schema: CollectionCreateSchema;
  private readonly client: Client;
  protected readonly schemaName: string;
  private utils = new TypesenseUtils();

  constructor(config: ConfigurationOptions, schema: CollectionCreateSchema) {
    this.client = new Typesense.Client(config);
    this.default_schema = schema;
    this.schemaName = this.default_schema.name;
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
    // -> Exception Handle Schema Already created or not
    this.utils.isSchemaExist(schema.name);

    if (!schema) {
      //-> If no schema provided, create a collection using the default schema
      return this.client.collections().create(this.default_schema);
    } else {
      //-> Create a collection using the provided schema
      return this.client.collections().create(schema);
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
    if (!collectionName) {
      // Retrieve all collections if no collectionName is specified
      return this.client.collections().retrieve();
    } else {
      // Retrieve a specific collection based on the provided name
      return this.client.collections(collectionName).retrieve();
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
    if (collectionName) {
      // Retrieve the schema of the specified collection
      return this.client.collections(collectionName).retrieve();
    } else {
      // Retrieve the schema of the default collection (this.schemaName)
      return this.client.collections(this.schemaName).retrieve();
    }
  }

  /**
   * Deletes a specific collection based on the provided name.
   * @param collectionName - The name of the collection to delete. if no collection name by default collection name point to the default schema name.
   * @returns A Promise that resolves when the specified collection is successfully deleted.
   * reference: https://typesense.org/docs/0.25.1/api/collections.html#drop-a-collection
   */
  public dropCollection(collectionName?: string): Promise<CollectionSchema> {
    if (collectionName) {
      return this.client.collections(collectionName).delete();
    } else {
      return this.client.collections(this.schemaName).delete();
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
  public updateCollection(
    collectionName: string,
    update_schema: CollectionUpdateSchema,
  ): Promise<CollectionSchema> {
    // -> Exception Handle Schema Already exist or not
    this.utils.isSchemaExist(collectionName);

    return this.client.collections(collectionName).update(update_schema);
  }
  /*=====  End of Collection related Methods  ======*/

  /*=============================================================
  =            Indexing your own document methods               =
  ==============================================================*/
  //TODO: working on indexing the document
  /*=======  End of Indexing your own document methods  =======*/
}
