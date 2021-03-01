# Considerations
## Open Library API Integration
After fiddling with the List API, it looks like list creation is prevented for CORS requests. Because of this, I went with using the browser's local storage to maintain some level of persistence. This isn't ideal, but it gets some level of the job done.

## TypeScript
This codebase does not implement TypeScript. Based on my unfamiliarity with it and the available time I had to allocate to this assignemtn, diving into it seemed out of scope.

## Tests
There is one included test, but based on time available, I did not scope out other tests that I would like to include. I'd be happy to talk about this in person.

## Scope
I did not implement the Notes feature for books. IMO, the scope of this coding assignment was large and considering other issues with integrating with the API, I did not take on adding notes.

## CSS/Design
I did not prioritize CSS and design for this MVP assignment. There is moderate CSS used, but I would not consider it a "best effort."

# Getting Started

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
