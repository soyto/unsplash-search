import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UnsplashImage} from '../models/UnsplashImage';
import {UnsplashSearchResult} from '../models/UnsplashSearchResult';
import {map} from 'rxjs/operators';

const CLIENT_ID = '8c7a5d3cba7695b7d150f8d9d2f1d2012f5536f05e2505793390e4de6c7fa07f';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  httpOptions: any;

  constructor(
      private http: HttpClient
  ) {


    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Client-ID ' + CLIENT_ID,
      }),
    };
  }

  /**
   * Search images through Unsplash API
   * @param query the query used to search the images
   * @param page The page itself that should look for
   */
  searchImages(query: string, page?: number): Observable<UnsplashSearchResult> {

    // If we don't know which is the page, set it
    if (!page || page < 1) { page = 1; }

    const url = 'https://api.unsplash.com/search/photos';
    let params = new HttpParams();

    params = params.set('query', query);
    params = params.set('per_page', '50'); // We want 50 items per page

    // If there is page
    if (page && page > 1) { params = params.set('page', page.toString()); }

    this.httpOptions.params = params;

    return this.http.get(url, this.httpOptions).pipe(map((e: any) => {
      const result = new UnsplashSearchResult();

      result.total = e.total;
      result.total_pages = e.total_pages;
      result.results = new Array<UnsplashImage>();
      result.searchTerm = query;

      for (const image of e.results) {
        result.results.push({
          id: image.id,
          height: image.height,
          width: image.width,
          urls: image.urls,
          description: image.description
        } as UnsplashImage);
      }

      return result;
    }));
  }

}
