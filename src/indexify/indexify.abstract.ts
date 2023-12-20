import { iIndexing } from 'src/types';
import {
  SearchParams,
  SearchResponse,
} from 'typesense/lib/Typesense/Documents';

export abstract class IndexifyAbstract {
  abstract indexing({
    data,
    schema,
    collection,
    options,
  }: iIndexing): Promise<string>;
  abstract searchResult(
    query: SearchParams,
    collection: string,
  ): Promise<SearchResponse<object>>;
}
