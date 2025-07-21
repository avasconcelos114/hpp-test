## Running project locally

To run the environment locally in development mode:

```bash
npm run dev
```

## Running in production mode with Docker

## Chosen Libraries

- `Next.js`: I've opted to use Next.js to validate UUIDs server-side when accessing a page and providing an already-populated response to the client (and handle invalid or failed requests)
- `Shadcn` + `TailwindsCSS`: To simplify component creation and focus the development time on feature completion rather than component structure or styling
- `Axios` + `React Query`: To streamline the async calls (request headers, interceptors), and allow for easy re-fetching on expiry, as well as showing the loading state when a quote is being refetched
- `Yup`: Used as a way to quickly be able to validate API responses
- `Cypress`: As most components in this test are simple by nature, I opted to perform a full panel of E2E testing rather than unit testing auto-generated components that were only mildly customized, to ensure that all required specs have been satisfied

## Considerations

- While not originally a part of the specs, I've opted to add an invalid transaction route (in the same design as the expired page) to allow the app to graciously fail and communicate to the user that something is amiss

- To simplify the testing process (and to provide a simple entry-point for the Cypress E2E testing), I have set the index page to be a simple landing page with a button that makes the `POST` `/api/v1/pay/summary` call, and redirects the user to the accept quote page

- I tried to keep fidelity to the style names in Figma as much as possible, but they turned out a bit strange, in this scenario I would have a chat with the designer to have a naming convention that works well both on Figma and on the codebase
