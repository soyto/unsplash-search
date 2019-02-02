# Unsplash-search

Small test project that search images on [Unsplash](https://unsplash.com/)

## Specifications
- Must search images on unsplash given a search term introduced by the user and show the results.
- User can view images full size
- Must be done on Angular

## Features
- [x] Can search images on unsplash given
- [x] Can show the images
- [x] Can load more images alterning with "infinite scroll" and "load more" button
- [x] If search doesn't produce results, show an empty screen
- [x] If there is any issue on saerch, show error screen
- [x] User can click on images to view em at full size
- [x] Full size images are loaded on background using "imagesloaded" technique. 

### Navigators

Tested with: 
- Desktop Google Chrome (71.0.3578.98) 
- Mobile Google Chrome (72.0.3626.76)

### Development server

Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Publish on gh-pages

Do a normal git commit

Run `npm run build` for production, then `git subtree push --prefix dist origin gh-pages` to publish on `gh-pages` branch