import { Injectable } from '@angular/core';
import { Mutex } from 'async-mutex';
import { catchError, from, mergeMap, Observable, of, toArray } from 'rxjs';
import { Url2Fetch } from '../types';

@Injectable()
export class JSConcurrencyService {
  public fetchUsingRxjs(
    urls: string[],
    maxConcurrency = 5
  ): Observable<string[]> {
    return from(urls.map((url, index) => ({ url, index }))).pipe(
      mergeMap(
        ({ url, index }) =>
          from(fetch(url)).pipe(
            mergeMap((response) =>
              of({ index, status: response.status.toString() })
            ),
            catchError((err) => of({ index, status: `Error: ${err}` }))
          ),
        maxConcurrency
      ),
      toArray(),
      mergeMap((results) => {
        const finalResults: string[] = [];
        results.forEach(({ index, status }) => {
          finalResults[index] = status;
        });
        return of(finalResults);
      })
    );
  }

  public async fetch(urls: string[], maxConcurrency = 5): Promise<string[]> {
    const resultsUrls: string[] = [];
    const queue = urls.map((url, index) => ({ url, index }));
    const mutex = new Mutex();

    const getNextItem = async (): Promise<Url2Fetch | null> => {
      return await mutex.runExclusive(() => {
        if (queue.length === 0) return null;
        return queue.shift()!;
      });
    };

    const worker = async () => {
      let hasItems = true;
      while (hasItems) {
        const item = await getNextItem();
        if (item !== null) {
          const { url, index } = item;
          try {
            const result = await fetch(url);
            resultsUrls[index] = result.status.toString();
          } catch (err) {
            console.error(`Error on ${url}`, err);
            resultsUrls[index] = `Error: ${err}`;
          }
        } else {
          hasItems = false;
        }
      }
    };

    const workers = Array.from({ length: maxConcurrency }, () => worker());
    await Promise.all(workers);

    return resultsUrls;
  }
}
