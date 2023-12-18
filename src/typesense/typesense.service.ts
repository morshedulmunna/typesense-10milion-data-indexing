// typesense.service.ts

import { Injectable } from '@nestjs/common';
import typesense from 'src/config/typesense.config';
import booksSchema from 'src/schema/bookSchema';

@Injectable()
export class TypesenseService {
  private readonly typesenseClient = typesense;

  async indexData(data: any): Promise<any> {
    try {
      await this.typesenseClient.collections().create(booksSchema);

      const result = await this.typesenseClient
        .collections('booksCollection')
        .documents()
        .import(data);

      console.log(result);
    } catch (error) {
      console.log(error);

      throw new Error(error.message);
    }
  }
}
