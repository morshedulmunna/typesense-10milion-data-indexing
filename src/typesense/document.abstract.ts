import {
  ImportResponse,
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

export abstract class DocumentAbstract {
  /*----------  Indexing Abstract  ----------*/
  abstract batchIndex(
    document: object[],
    collection: string,
  ): Promise<ImportResponse[]>;

  /*----------  Single Document Indexing  ----------*/
  abstract singleIndex(document: object, collection: string): Promise<object>;

  /*----------  search result abstract  ----------*/
  abstract searchResult(
    query: SearchParams,
    collection: string,
  ): Promise<SearchResponse<object>>;
}
