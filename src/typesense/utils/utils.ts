import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { TypesenseClient } from '../typesense';

@Injectable()
export class TypesenseUtils extends TypesenseClient {
  constructor(config?: ConfigurationOptions, schema?: CollectionCreateSchema) {
    super(config, schema);
  }

  /**
   * Checks if a schema with the provided name exists.
   * Throws an exception if the schema already exists or if it doesn't exist.
   * @param schemaName - The name of the schema to checking.
   * @throws ConflictException - Throws if the schema already exists.
   * @throws NotFoundException - Throws if the schema doesn't exist.
   */
  async isSchemaExist(schemaName: string): Promise<void> {
    const res = await this.retrieveSingleCollection(
      schemaName || this.schemaName,
    );

    if (res.name === schemaName || this.schemaName) {
      throw new ConflictException(
        `${schemaName || this.schemaName} Already Exist!`,
      );
    }

    if (res.name !== schemaName || this.schemaName) {
      throw new NotFoundException(
        `${schemaName || this.schemaName} not exist!`,
      );
    }
  }
}
