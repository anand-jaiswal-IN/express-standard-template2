# Express Standard Template

This project provides a robust and scalable starting point for building RESTful APIs with Express.js, TypeScript, ESLint, Prettier, and Vitest. It's designed to accelerate development by offering a well-structured and opinionated foundation.

## Features

- **TypeScript:** For type safety and improved developer experience.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **ESLint & Prettier:** For consistent code style and quality.
- **Vitest:** A blazing fast unit test framework powered by Vite.
- **Helmet:** Helps secure Express apps by setting various HTTP headers.
- **CORS:** Cross-Origin Resource Sharing enabled with configurable options.
- **Rate Limiting:** Protects against brute-force attacks and excessive requests.
- **Error Handling:** Centralized error handling middleware.
- **Project Structure:** Logical and scalable folder structure.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/anand-jaiswal-IN/express-standard-template2.git
    cd express-standard-template2
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Create `.env` file:**
    Copy the `.env.example` file and rename it to `.env`.

    ```bash
    cp .env.example .env
    ```

## Environment Variables

Configure your environment variables in the `.env` file.

```
PORT=3000
NODE_ENV=development/production

# CORS configuration
CORS_ORIGIN=*

# Helmet Content Security Policy (optional)
# Example: HELMET_CSP=https://yourdomain.com
HELMET_CSP=
```

## Available Scripts

- `bun run dev`: Starts the development server with hot-reloading using `tsx` and `.env.development`.
- `bun run dev:prod`: Starts the development server with hot-reloading using `tsx` and `.env.production`.
- `bun run start`: Starts the production server using `node` and `.env.production`.
- `bun run build`: Compiles TypeScript to JavaScript and creates `dist` folder.
- `bun run test`: Runs tests with Vitest. [[memory:7021713]]
- `bun run test:run`: Runs tests once with Vitest.
- `bun run test:ui`: Starts Vitest UI for interactive testing.
- `bun run coverage`: Generates test coverage report.
- `bun run type-check`: Checks TypeScript types without emitting files.
- `bun run lint`: Lints the codebase using ESLint. [[memory:7025258]]
- `bun run lint:fix`: Lints the codebase and fixes autofixable issues.
- `bun run format`: Formats the codebase using Prettier.
- `bun run format:check`: Checks codebase formatting with Prettier.
- `bun run prepare`: Sets up Husky git hooks.
- `bun run check-before-commit`: Runs ESLint and Prettier checks before commit.

## Project Structure

```
.
├── src/
│   ├── app.ts                 # Main Express application setup
│   ├── server.ts              # Server entry point
│   ├── middlewares/           # Custom Express middlewares
│   │   ├── errorHandler.ts    # Centralized error handling
│   │   ├── middlewares.ts     # Helmet, CORS, Morgan configuration
│   │   └── rateLimit.ts       # Rate limiting middleware
│   └── utils/                 # Utility functions
├── tests/
│   ├── app.test.ts            # Example tests for app
│   └── rateLimit.test.ts      # Tests for rate limiting
├── .env.example               # Example environment variables
├── eslint.config.js           # ESLint configuration
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vitest.config.js           # Vitest configuration
└── README.md                  # Project documentation
```

## API Endpoints

- **`/`**: Basic route returning "Hello World!".
- **`/error`**: Route to test error handling middleware.
- **`/slow`**: Route demonstrating a slow response (async operation).
- **`/health`**: Health check endpoint.
- **`/limiter/strict`**: Example route with strict rate limiting.
- **`/limiter/auth`**: Example route with authentication-specific rate limiting (POST).

## Security

This project uses the following security features:

- **Helmet:** Helps secure Express apps by setting various HTTP headers.
- **CORS:** Configured to allow cross-origin requests.
- **Rate Limiting:** Implemented using `express-rate-limit` to protect against abuse.

## Customization

- **Environment Variables:** Adjust `PORT`, `CORS_ORIGIN`, and `HELMET_CSP` in your `.env` file.
- **Middleware:** Customize `src/middlewares/middlewares.ts` for Helmet and CORS options, and `src/middlewares/rateLimit.ts` for rate limiting rules.
- **Routes:** Define your API routes in `src/app.ts` or create separate route modules.
- **Scripts:** Modify `package.json` scripts for different development or deployment workflows.

## Running Tests

Tests are written with [Vitest](https://vitest.dev/).
To run all tests:

```bash
bun run test
```

To run tests in watch mode:

```bash
bun run test
```

To run tests once:

```bash
bun run test:run
```

To view a coverage report:

```bash
bun run coverage
```

## Linting

This project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code linting and formatting.

To lint the codebase:

```bash
bun run lint
```

To lint and fix autofixable issues:

```bash
bun run lint:fix
```

To format the codebase:

```bash
bun run format
```

## License

This project is licensed under the GNU AFFERO GENERAL PUBLIC License - see the [LICENSE](LICENSE) file for details.

## Author

Anand Jaiswal
