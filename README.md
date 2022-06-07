# wishtree-web

## Introduction
Wishtree-web is the front-end project for the wishtree service. Features the landing page as well as an admin page.

## Configuration
### Texts and appearance
- Various texts displayed on the page can be configured by changing the contents of the `src/texts.json` file.
- The page title can be altered in `public/index.html`. Look for the two occurrences of "Ønsketre for kommunen".
- The favicon can be found and replaced in `public/favicon.ico`.

### Colors
- The colors used on the website can be changed in `src/theme.js`. The main color of note here is `primary` > `main`, which is used on buttons and various other elements.
- The "theme color", which affects the browser background outside the website itself in some browsers, can be changed in `public/manifest.json`, as the value named `theme_color`.
- The colors of the categories selectable by the users are located in the database, not in this project.

### URL
Additionally, if the website URL is not the same as that of the API, the content of `setupProxy.js` must be uncommented, and the URL of the API (whithout `/wishtree-api`) must be placed in the `target` value.

## Building
After cloning/downloading this repo, enter the project folder and run `yarn`, followed by `yarn build`. The production-ready files will be placed in the `dist` folder. You will serve the `index.html` static file.

### Docker
If you wish to run the font-end in a Docker container rather than serving the static files directly, build a container with `docker build . -t IMAGE_NAME:TAG`, inserting your own image name and tag. The container will serve the static files with the very lightweight Caddy server.
Running the docker image could be done with `docker run -d --rm -it -p 8080:8080 IMAGE_NAME:TAG`, inserting your own image name and tag.
