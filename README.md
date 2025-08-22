# Express TypeScript ESLint Prettier Template

An Express.js template with TypeScript, ESLint and Prettier

## Features

- **TypeScript**: Full TypeScript support with strict configuration
- **ESLint**: Code linting with perfectionist plugin
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **Husky**: Git hooks for pre-commit linting and formatting
- **Modern Logging System**: Winston and Morgan for comprehensive logging

## Logging System

This template includes a modern, robust logging system with the following features:

- **Multi-transport logging**: Console and file-based logging
- **Environment-specific configurations**: Different log levels for development and production
- **HTTP request logging**: Detailed request/response logging with Morgan
- **Error tracking**: Comprehensive error logging with stack traces
- **Performance monitoring**: Slow request detection and timing
- **Structured logging**: JSON format for machine-readable logs
- **Log rotation**: Automatic log file rotation with size limits

For detailed logging documentation, see [LOGGING.md](./LOGGING.md).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run dev:staging` - Start staging server
- `npm run dev:prod` - Start production server
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Run tests with coverage
- `npm run type-check` - Type check without emitting
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and fix code
- `npm run format` - Format code
- `npm run format:check` - Check code formatting

## Environment Variables

Create environment files for different environments:

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

## Project Structure

```
src/
├── __tests__/          # Test files
├── middlewares/        # Express middlewares
├── utils/             # Utility functions
├── app.ts             # Express app configuration
└── server.ts          # Server entry point
```

## Testing

The project uses Vitest for testing. Tests are located in the `src/__tests__/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC
