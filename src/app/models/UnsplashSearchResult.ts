import {UnsplashImage} from './UnsplashImage';

export class UnsplashSearchResult {
    searchTerm: string;
    results: Array<UnsplashImage>;
    total: number;
    total_pages: number;
}
