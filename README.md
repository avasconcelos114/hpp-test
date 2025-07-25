# BVNK Test by Andre Vasconcelos

Welcome to my humble repo, this is my take on how I would implement a Hosted Payments Page, as described in the [BVNK Interviews page](https://github.com/BVNK-Interviews/frontend-hpp-test). I had a lot of fun working on it and I tried to make the best use of time as possible by adding some _extra_ spices to make the app both accessible and robust :)

Note: Some of the comments in the repo have been prefixed with `META:` to signify that they are comments pertaining to the test rather than being a general comment regarding a functionality

## Prerequisites

- Node 20.19.0 (Ideally with an NVM setup)
- Yarn (But NPM is fine too)
- [Optional] Docker -- only if you're keen on building and running the project with Docker

## Running project locally

0. Run `nvm use` if you're running NVM to auto switch to the right node version (if it's not installed yet, run `nvm install 20.19.0` first)

1. Install all the needed dependencies

```bash
yarn
```

3. Run in dev mode

```bash
yarn dev
```

Voila! You have a running local dev environment, feel free to test to your heart's content

## Running in production mode with Docker

If you're looking to simulate how this could run in production, you are welcome to build the Docker image and run it locally as well!

0. Build it

```bash
yarn docker:build
```

1. Run it

```bash
yarn docker:run
```

## Running Unit Tests

0. Start the test runner (with coverage reporting)

```bash
yarn test:coverage
```

## Running E2E Tests

0. Run the project in test mode to enable instrumentation (code coverage reporting will not work otherwise)

```bash
NODE_ENV=test yarn dev
```

1. Run the cypress runner (to run the E2E tests properly, you will need to make an API call to create a payment manually, and then use its uuid value in the env var below, Cypress will work its ✨ magic ✨ from here)

```bash
yarn cypress:run --env uuid={PASTED_UUID}
```

I would have liked to create a cypress task that makes a call to create a payment and injects its UUID on its own, but that would mean having to set up API credentials as the project's env vars so I decided to keep the basics simple

2. Check converage reports

```bash
yarn cypress:coverage
```

## Main Libraries/Tooling Used

- `Next.js`: I've opted to use Next.js to validate UUIDs server-side when accessing a page and providing an already-populated response to the client (and handle invalid or failed requests)
- `Shadcn` + `TailwindsCSS`: To simplify component creation and focus the development time on feature completion rather than component structure or styling
- `Axios` + `React Query`: To streamline the async calls (request headers, interceptors), and allow for easy re-fetching on expiry, as well as showing the loading state when a quote is being refetched
- `Yup`: Used as a way to quickly be able to validate API responses/values and improve the error handling
- `Jotai`: Very light-weight state management library to simplify and centralize access to the currencies fetched from the API
- `Vitest` + `React Testing Library`: Used to perform unit tests on the utility functions and components
- `Cypress`: Chosen as a way to automate tests with live data from the perspective of the user (Behavior Driven)

## Considerations

- While not originally a part of the specs, I've added more robust forms of error handling that expand beyond the expired page, which accounts for invalid UUIDs in the URL, as well as a few of the error codes present in the https://docs.bvnk.com/reference/errors documentation

- As a personal challenge, I tried to make all pages screen-reader friendly (tested with VoiceOver on MacOS) and keyboard navigatable

- As an _extra_ bit of challenge, I also used one of the BVNK APIs to fetch the list of cryptocurrencies supported by BVNK, so that you can make full use of the `currencyOptions` part of the response from the crypto summary API

- I tried to keep fidelity to the style names in Figma as much as possible, but they turned out a bit strange when getting "translated" to TailwindsCSS-compatible names, in this scenario I would collaborate with designers to get a good naming convention that is clear and works well both for developers _and_ designers

- We have a cocktail of unit and E2E tests since we want both to have control over individual features of each UI component / utility / hook, but we also want to make sure that the entire flow from the perspective of the user behaves as intended. While neither test suite has achieved 100% coverage, each of them are testing the aspects that the other isn't able to individually (e.g. The unit tests cover the defensive code and error catcher that the E2E env can't reproduce, and the E2E environment makes live API calls and runs schema validations in a way unit tests can't)

## Suggestions

- The [Timers](https://github.com/BVNK-Interviews/frontend-hpp-test?tab=readme-ov-file#timers) section in the README file that contains the instructions could benefit from having its endpoint corrected to `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/update/summary`, since the `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary` endpoint seems to result in an internal server error and is nowhere to be found in the API documentation (but then again, it _could_ stay as a part of the test to push us test takers to find and study the API docs 😉)
  - On a similar note, it seems as though the `payInMethod` value is no longer required as part of the payload and could be removed from the README
