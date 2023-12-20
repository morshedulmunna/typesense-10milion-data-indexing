import { iIndexing } from 'src/types';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

export abstract class IndexifyAbstract {
  /*----------  Indexing Abstract  ----------*/
  abstract indexing({
    data,
    schema,
    collection,
    options,
  }: iIndexing): Promise<string>;

  /*----------  search result abstract  ----------*/
  abstract searchResult(
    query: SearchParams,
    collection: string,
  ): Promise<SearchResponse<object>>;
}
