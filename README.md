# BVNK Test by Andre Vasconcelos

Welcome to my humble repo! This is my take on implementing a Hosted Payments Page, as described in the [BVNK Interviews page](https://github.com/BVNK-Interviews/frontend-hpp-test). I had a lot of fun working on it and tried to make the best use of time by adding some _extra_ spices to make the app both accessible and robust!

> **Note:** Comments prefixed with `META:` in the codebase are specifically about the test requirements rather than general functionality comments.

## 📋 Prerequisites

- **Node.js** 20.19.0 (ideally with NVM setup)
- **Yarn** (NPM works too)
- **Docker** (optional - for containerized development)

## 🛠️ Tech Stack

| Category             | Technology                     | Purpose                                                              |
| -------------------- | ------------------------------ | -------------------------------------------------------------------- |
| **Framework**        | Next.js                        | Server-side UUID validation, pre-populated responses, error handling |
| **Styling**          | Shadcn + TailwindCSS           | Speeding up component development and keeping styles consistent      |
| **Data Fetching**    | Axios + React Query            | Streamlined async operations and flexible state management           |
| **Validation**       | Yup                            | API response validation and improved error handling                  |
| **State Management** | Jotai                          | Lightweight state management for centralized currency data           |
| **Testing**          | Vitest + React Testing Library | Unit testing for utilities and components                            |
| **E2E Testing**      | Cypress.io                     | Behavior-driven testing with live environment                        |

## 🗺️ Project Structure

```bash
.
├── cypress/
│   ├── e2e/            # Where the E2E Test Suites live in
│   └── support/        # Where we have custom configuration for Cypress
├── src/
│   ├── api/            # The Axios configuration + All async calls to server
│   ├── app/            # The place for all the page configurations and providers
│   ├── components/
│   │   ├── containers/ # Stateful components that comprise the main parts of the app
│   │   ├── ui/         # Stateless UI components
│   │   └── ...         # Any other simple components that are stateful
│   ├── hooks/          # custom hooks that abstract away business logic and reusable component logic
│   ├── lib/
│   │   ├── schemas/    # Where Zod schemas and related types are maintained
│   │   └── tests/      # Where we keep mock data for unit tests
└   └── store/          # Where we keep jotai stores
```

## 🚀 Getting Started

### Local Development

1. **Switch to correct Node version** (if using NVM):

   ```bash
   nvm install 20.19.0
   nvm use
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Start development server**:

   ```bash
   yarn dev
   ```

   Voilà! You now have a running local development environment. Feel free to test to your heart's content! 🎉

### Production with Docker

I decided to use Docker for a quick and easy way to have a production environment running that can be replicated to live infrastructure

1. **Build the Docker image**:

   ```bash
   yarn docker:build
   ```

2. **Run the container**:
   ```bash
   yarn docker:run
   ```

## 🧪 Testing

### Unit Tests

Run the test suite with coverage reporting:

```bash
yarn test:coverage
```

### E2E Tests

1. **Start the project in test mode** (required for instrumentation):

```bash
NODE_ENV=test yarn dev
```

2. **Run Cypress tests**:

```bash
yarn cypress:run --env uuid={PASTED_UUID}
```

> **Note:** You'll need to manually create a payment via API call and use its UUID in the environment variable. I considered automating this with Cypress tasks, but it would require exposing API credentials in environment variables, so I resisted the urge and kept it simple

3. **Check coverage reports**:

```bash
yarn cypress:coverage
```

## 🎯 Key Features & Enhancements

### Accessibility & Performance

- **Screen reader friendly** (tested with VoiceOver on macOS)
- **Full keyboard navigation** support
- **500ms** to render a fully populated view with no cumulative layout shift

![](/docs/lighthouse_results.png)

> **Note:** For screen reader testing, run app in production mode (via Docker or `yarn start`) as Next.js devtools can interfere with keyboard focus.

### Error Handling

- **Robust error management** with handling for multiple flows that include checking for invalid UUID values, "illegal" summary updates, and mapping of many of the error codes present in the [BVNK API documentation](https://docs.bvnk.com/reference/errors)

### API Integration

- **Dynamic cryptocurrency fetching** using BVNK APIs to retrieve the full list of supported currencies, with a fallback mechanism to the assigned 3 (`BTC`, `ETH`, `LTC`)

### Design Fidelity

- **Figma style adherence** for color naming, as well as other paddings and margin values

> **Note:** Some of the color variable names ended up sounding a little awkward when used as a TailwindsCSS class, in a real production scenario I would collaborate with designers so that the design language can be aligned and work for both designers and developers

## 🧪 Testing Strategy

I decided to employ a **dual testing approach**:

| Test Type      | Coverage                   | Purpose                                                          |
| -------------- | -------------------------- | ---------------------------------------------------------------- |
| **Unit Tests** | Component/utility features | Snapshot testing for UI components, error handling, edge cases   |
| **E2E Tests**  | Behavior driven testing    | Testing full scenarios from user perspective with live API calls |

> **Why both?** Each test suite covers aspects the other cannot. Unit tests handle defensive code that E2E can't easily reproduce, while E2E tests make live API calls and validate schemas in ways that are more reliable than mocking static responses

## 💡 Suggestions for Improvement

### API Documentation Updates

The [Timers section](https://github.com/BVNK-Interviews/frontend-hpp-test?tab=readme-ov-file#timers) in the original README could benefit from:

1. **Endpoint correction**:
   - ❌ `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/summary`
   - ✅ `PUT https://api.sandbox.bvnk.com/api/v1/pay/<UUID>/update/summary`

   The original endpoint described in the README results in internal server errors and isn't documented in the API docs, though of course this "incorrect" endpoint could be kept as part of the test to encourage us test takers to study the API! 😉

2. **Payload simplification**: The `payInMethod` value from the update summary API is not a required value and could be removed from the README

### Supported Currencies in sandbox environment

While not something I _should_ have discovered by following the test parameters, but I found that attempting to assign PayPal USD (`PYUSD`) or Polygon (`POL`) to a transaction (as they were included in `currencyOptions`) very steadily causes a 500 error in the sandbox environment.

I'm not sure if this is expected and a known issue but I thought it would help to report it
