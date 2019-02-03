import {Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {UnsplashImage} from '../../models/UnsplashImage';
import {UnsplashService} from '../../services/unsplash.service';
import {TimeTriggerService} from '../../services/time-trigger.service';
import {DomSanitizer} from '@angular/platform-browser';
import {animate, style, transition, trigger} from '@angular/animations';

const NAME = 'app-main';
const SEARCH_TIMEOUT_NAME = NAME + '.search';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('.5s ease-out', style({opacity: 1}))
      ])
    ])
  ]
})
export class MainComponent implements OnInit {

  @ViewChild('search_input') searchInputElement: ElementRef;
  @Input() searchInput: string;

  selectedImage: UnsplashImage;

  searchResult: {
    total: number,
    searchTerm: string,
    total_pages: number,
    results: Array<UnsplashImage>,
    currentPage: number
  };

  $$state = {
    firstEmpty: true,
    empty: false,
    searching: false,
    loadingMore: false,
    isError: false
  };

  constructor(
      private unsplashService: UnsplashService,
      private timeTrigger: TimeTriggerService,
      public sanitizer: DomSanitizer
  ) {
  }

  /**
   *  On init
   */
  ngOnInit() {

    this.searchResult = {
      total: null,
      searchTerm: null,
      total_pages: null,
      results: new Array<UnsplashImage>(),
      currentPage: null
    };

    // Auto focus the element
    this.searchInputElement.nativeElement.focus();
  }

  /**
   * When user press a key on the input
   * @param args event arguments
   */
  onKeydown_searchInput(args: any): void {

    // If user press enter key, do search immediatly
    if (args.keyCode === 13 && !args.altKey && !args.shiftKey && !args.ctrlKey ) {
      this.doSearch();
    } else { // Else, try to search on 1500 ms
      this.timeTrigger.trigger(SEARCH_TIMEOUT_NAME, () => {
        this.doSearch();
      }, 1500);
    }
  }

  /**
   * When user press on search button
   */
  onClick_search(): void {
    this.doSearch();
  }

  /**
   * When the window scroll changes, call this
   */
  onScroll_window(): void {

    // If we don't have results, don't do nothing
    if (this.searchResult.currentPage < 0) { return; }

    // If we are on a pair page, don't do nothing
    if (this.searchResult.currentPage % 2 === 0) { return; }

    // Access to the window object, a bit ugly but the fastest solution that i founded
    const currentScroll = window.pageYOffset + window.innerHeight;
    const maxHeight = Math.max(window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.body.clientHeight);
    const currentPercent = Math.round(currentScroll * 100 / maxHeight);

    // If percent is greater than 70 then do a loadMore action
    if (currentPercent >= 70) { this.loadMore(); }

  }

  /**
   * When the user clicks on the load more button
   */
  onClick_loadMore(): void {
    this.loadMore();
  }

  /**
   * When user clicks on an image
   * @param image the image
   */
  onClick_selectImage(image: UnsplashImage): void {
    this.selectedImage = image;

    // Again a bit ugly, but we need to prevent that body can scroll
    window.document.body.classList.add('modal-open');
  }

  /**
   * When user closes the image preview
   */
  onImagePreview_close(): void {
    this.selectedImage = null;

    // Again a bit ugly, but we need that body can scroll
    window.document.body.classList.remove('modal-open');
  }

  /**
   * Does the search itself
   */
  private doSearch(): void {

    // If there is nothing to search, don't search
    if (!this.searchInput || this.searchInput.trim().length === 0) { return; }

    // If it's searching, why are you going to search again
    if (this.$$state.searching) { return; }

    // If we had a previous search and the search term is the same as the current
    if (this.searchResult.currentPage > 0 && this.searchInput.trim() === this.searchResult.searchTerm) {

      // Empty the searchInput
      this.searchInput = '';

      return;
    }

    // Cancel the Search Timeout
    this.timeTrigger.cancel(SEARCH_TIMEOUT_NAME);

    // Set up that we are searching
    this.$$state.searching = true;

    // Also is no longer first empty
    this.$$state.firstEmpty = false;

    // And also isn't an error (yet)
    this.$$state.isError = false;

    // Empty previous result
    this.searchResult = null;

    // Maybe is not empty now
    this.$$state.empty = false;

    // We are doing a new search, then empty the results
    this.searchResult = {
      total: null,
      searchTerm: null,
      total_pages: null,
      results: new Array<UnsplashImage>(),
      currentPage: null
    };

    const currentPage = 1;

    // Do the search itself
    this.unsplashService.searchImages(this.searchInput.trim()).subscribe(data => {

      // If there are no results, set empty state
      if (data.total === 0) {
        this.$$state.empty = true;
      }

      // Set up result items
      this.searchResult.total = data.total;
      this.searchResult.searchTerm = data.searchTerm;
      this.searchResult.total_pages = data.total_pages;
      this.searchResult.currentPage = currentPage;

      for (const item of data.results) { this.searchResult.results.push(item); }

      // Clean the search input
      this.searchInput = '';

      // When we get the data, stop searching
      this.$$state.searching = false;

      // If result is empty, focus the input again
      if (this.$$state.empty) {
        setTimeout(() => this.searchInputElement.nativeElement.focus(), 500);
      }
    }, error => {
      this.$$state.isError = true;
    });
  }

  /**
   * Load more images from previous search
   */
  private loadMore(): void {

    // If we are on last page, don't do nothing
    if (this.searchResult.currentPage >= this.searchResult.total_pages) { return; }

    // If it's searching or loading more, don't do nothing
    if (this.$$state.searching || this.$$state.loadingMore) { return; }

    // Indicate that we are loading more
    this.$$state.loadingMore = true;

    this.unsplashService.searchImages(this.searchResult.searchTerm, ++this.searchResult.currentPage).subscribe(data => {

      // Set up result items
      this.searchResult.total = data.total;
      this.searchResult.searchTerm = data.searchTerm;
      this.searchResult.total_pages = data.total_pages;

      for (const item of data.results) { this.searchResult.results.push(item); }

      // Stop indicating that we are loading more
      this.$$state.loadingMore = false;
    }, error => {

      // If there is some error loading more, just adjust total_pages to be the currentPage
      this.searchResult.total_pages = this.searchResult.currentPage;
    });
  }
}
