import { TestBed } from "@angular/core/testing";
import { JSConcurrencyService } from "./js-concurrency,service";
import { firstValueFrom } from "rxjs";

/**
 * Test suite for JSConcurrency Service
 *
 * In this test suite is used to verify two methods to fetch a lot of URLs with maximum concurrency.
 * The methods makes the same, the difference is how to implemnted, the first methods is implemented with RxJS
 * and the second with workers.
 *
 * To verify this methods I have designed three test:
 *
 * - Carrect way: fetch all the urls with correct HTTP code
 *
 * - Error fetching: when test is fetching then return error connection
 *
 * - Respect concurrency: verify if the method fetch URLs respect maximum concurrency
 */

const urls = [
  "https://a.com",
  "https://b.com",
  "https://c.com",
  "https://d.com",
];

describe('fetch urls using RxJS', () => {

  let service: JSConcurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JSConcurrencyService],
    });
    service = TestBed.inject(JSConcurrencyService);
    window.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch all URLs', async() => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({status: 200})
    );
    try {
      const results = await firstValueFrom(service.fetchUsingRxjs(urls));
      expect(results.length).toEqual(4);
      expect(results).toEqual(['200', '200', '200', '200']);
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });

  it('should handle fetch error', async () => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      Promise.reject('Network failure')
    );

    try {
      const results = await firstValueFrom(service.fetchUsingRxjs(urls));
      expect(results.length).toEqual(4);
      results.forEach(result => expect(result).toEqual('Error: Network failure'));
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });

  it('should respect max concurrency', async () => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 100)));

    const start = Date.now();
    try {
      const results = await firstValueFrom(service.fetchUsingRxjs(urls, 2));
      const duration = Date.now() - start;
      expect(results.length).toEqual(4);
      expect(results).toEqual(['200', '200', '200', '200']);
      expect(duration).toBeGreaterThanOrEqual(200); // 4 urls / 2 pipes * 100ms
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });

});

describe('fetch urls using workers', () => {

  let service: JSConcurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JSConcurrencyService],
    });
    service = TestBed.inject(JSConcurrencyService);
    window.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch all URLs', async() => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({status: 200})
    );
    try {
      const results = await service.fetch(urls);
      expect(results.length).toEqual(4);
      expect(results).toEqual(['200', '200', '200', '200']);
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });

  it('should handle fetch error', async () => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      Promise.reject('Network failure')
    );

    try {
      const results = await service.fetch(urls);
      expect(results.length).toEqual(4);
      results.forEach(result => expect(result).toEqual('Error: Network failure'));
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });

  it('should respect max concurrency', async () => {
    (window.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ status: 200 }), 100)));

    const start = Date.now();
    try {
      const results = await service.fetch(urls, 2);
      const duration = Date.now() - start;
      expect(results.length).toEqual(4);
      expect(results).toEqual(['200', '200', '200', '200']);
      expect(duration).toBeGreaterThanOrEqual(200); // 4 urls / 2 pipes * 100ms
    } catch (error: any) {
      throw Error('Unexpected error ', error);
    }
  });
});
