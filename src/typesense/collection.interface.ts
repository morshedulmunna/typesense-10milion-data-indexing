import { Injectable } from '@nestjs/common';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { TypesenseClient } from './typesense';

@Injectable()
export class CollectionService extends TypesenseClient {
  constructor(config: ConfigurationOptions, schema: CollectionCreateSchema) {
    super(config, schema);
  }
}
