import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UnsplashImage} from '../../models/UnsplashImage';
import {ImageLoadService} from '../../services/image-load.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

  currentUnasplashImage: UnsplashImage;
  currentImageUrl: string;

  /**
   * Setter for the InputValue currentImage
   * @param value
   */
  @Input() set currentImage(value: UnsplashImage) {

    // Store the value
    this.currentUnasplashImage = value;

    // If it's not null value and has urls property
    if (this.currentUnasplashImage && this.currentUnasplashImage.urls) {

      // Just set small thumb
      this.currentImageUrl = this.currentUnasplashImage.urls.small;

      // Now wait till we load full url
      this.imageLoadService.imageLoad(this.currentUnasplashImage.urls.full).then(() => {

        // And then, set it
        this.currentImageUrl = this.currentUnasplashImage.urls.full;
      });
    } else { // When no value
      this.currentImageUrl = '';
    }
  }

  /**
   * Property getter for the currentImage Input
   */
  get currentImage(): UnsplashImage {
    return this.currentUnasplashImage;
  }

  @Output() close = new EventEmitter();


  constructor(
      private imageLoadService: ImageLoadService
  ) { }

  ngOnInit() {
  }

  /**
   * When user attempts to close this
   */
  onClick_close(): void {
    this.close.next();
  }


}
