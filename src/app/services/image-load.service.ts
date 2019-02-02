import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageLoadService {

  constructor() { }

  imageLoad(url: string): Promise<any> {
    return new Promise<any>(done => {

      // Access to DOM to generate img, another time is ugly, but effective
      const img = window.document.createElement('img');
      img.onload = done; // When image loaded, call done
      img.src = url;
    });
  }
}
