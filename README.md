# BVNK Test by Andre Vasconcelos

Welcome to my humble repo, this is my take on how I would implement the payment journey described in the [BVNK Interviews page](https://github.com/BVNK-Interviews/frontend-hpp-test). I had a lot of fun working on it and I tried to make the best use of time as possible by adding some _extra_ spices to make the app both accessible and robust :)

## Prerequisites

- Node 20.17.0 (Ideally with an NVM setup)

## Running project locally

0. Run `nvm use` if you're running NVM to auto switch to the right node version (if it's not installed yet, run `nvm install 20.17.0` first)

1. Install all the needed dependencies

```bash
yarn
```

3. Run in dev mode

```bash
yarn dev
```

Voila! You have a running local dev environment, feel free to test to you heart's content

## Running in production mode with Docker

If you're looking to simulate how this could run in production, you are welcome to build the Docker image and run it locally as well 0. Build it

```bash
yarn docker:build
```

1. Run it

```bash
yarn docker:run
```

## Main Libraries Used

- `Next.js`: I've opted to use Next.js to validate UUIDs server-side when accessing a page and providing an already-populated response to the client (and handle invalid or failed requests)
- `Shadcn` + `TailwindsCSS`: To simplify component creation and focus the development time on feature completion rather than component structure or styling
- `Axios` + `React Query`: To streamline the async calls (request headers, interceptors), and allow for easy re-fetching on expiry, as well as showing the loading state when a quote is being refetched
- `Yup`: Used as a way to quickly be able to validate API responses/values and improve the error handling
- `Zustand`: Very light-weight state management library to simplify and centralize access to the currencies fetched from the API
- `Cypress`: As most components in this test are simple by nature, I opted to perform a full panel of E2E testing rather than unit testing auto-generated components that were only mildly customized, to ensure that all required specs have been satisfied

## Considerations

- While not originally a part of the specs, I've added more robust forms of error handling that expand beyond the expired page, which accounts for invalid UUIDs in the URL, as well as a few of the error codes present in the https://docs.bvnk.com/reference/errors documentation

- As a personal challenge, I tried to make all pages and components screen-reader compatible (tested with NVDA) and keyboard navigatable

- I tried to keep fidelity to the style names in Figma as much as possible, but they turned out a bit strange when getting "translated" to TailwindsCSS-compatible names, in this scenario I would collaborate with designers to get a good naming convention that is clear and works well both for developers _and_ designers

## Suggestions

- The [Timers](https://github.com/BVNK-Interviews/frontend-hpp-test?tab=readme-ov-file#timers) section in the README file that contains the instructions could benefit from having its endpoint corrected to `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/update/summary`, since the `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary` endpoint seems to result in an internal server error and is nowhere to be found in the API documentation (but then again, it _could_ stay as a part of the test to push us to find and study the API docs)
