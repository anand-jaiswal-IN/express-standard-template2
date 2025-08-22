# Express Standard Template 2

A modern, production-ready Express.js template with TypeScript, comprehensive logging, performance monitoring, and robust error handling. This template provides a solid foundation for building scalable Node.js APIs with industry best practices.

[![Node.js](https://img.shields.io/badge/Node.js-22+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1+-black.svg)](https://expressjs.com/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## 🚀 Features

### Core Features
- **TypeScript Support** - Full TypeScript configuration with strict type checking
- **Modern Express.js** - Latest Express.js v5 with enhanced performance
- **ES Modules** - Native ES module support with path aliases
- **Environment Configuration** - Multi-environment support (development, staging, production)

### Logging & Monitoring
- **Comprehensive Logging** - Winston-based logging with daily rotation
- **HTTP Request Logging** - Morgan middleware with custom tokens
- **Performance Monitoring** - Automatic slow request detection
- **Error Tracking** - Structured error logging with full context
- **Log Rotation** - Daily log rotation with compression and retention policies

### Security & Rate Limiting
- **Rate Limiting** - Multiple rate limiting strategies for different endpoints
- **Error Handling** - Custom error classes with proper HTTP status codes
- **Request Validation** - Comprehensive input validation and sanitization
- **Security Headers** - Production-ready security configurations

### Development Experience
- **Hot Reload** - Development server with automatic restart
- **Code Quality** - ESLint and Prettier with pre-commit hooks
- **Testing** - Vitest testing framework with coverage reports
- **Type Safety** - Strict TypeScript configuration with path aliases

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Logging System](#-logging-system)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anand-jaiswal-IN/express-standard-template2.git
   cd express-standard-template2
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using bun
   bun install
   ```

3. **Set up environment files**
   ```bash
   # Create environment files
   cp .env.example .env.development
   cp .env.example .env.production
   cp .env.example .env.staging
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Test the application**
   ```bash
   curl http://localhost:3000
   # Response: {"message": "Hello World!"}
   ```

## 📁 Project Structure

```
├── src/                          # Source code
│   ├── app.ts                   # Express application setup
│   ├── server.ts                # Server startup and configuration
│   ├── middlewares/             # Custom middleware
│   │   ├── errorHandler.ts     # Error handling middleware
│   │   ├── logging.ts          # Morgan HTTP logging
│   │   ├── middlewares.ts      # General middleware
│   │   └── rateLimit.ts        # Rate limiting configuration
│   ├── utils/                   # Utility functions
│   │   └── logger.ts           # Winston logger configuration
│   └── __tests__/              # Test files
├── docs/                        # Documentation
│   └── logging.md              # Logging system documentation
├── logs/                        # Log files (auto-generated)
├── dist/                        # Compiled JavaScript (auto-generated)
├── package.json                 # Project configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── vitest.config.js            # Vitest configuration
```

## ⚙️ Configuration

### Environment Variables

Create environment-specific configuration files:

#### `.env.development`
```bash
NODE_ENV=development
PORT=3000
```

#### `.env.production`
```bash
NODE_ENV=production
PORT=3000
```

### TypeScript Configuration

The project uses path aliases for clean imports:

```typescript
// Instead of: import logger from '../../utils/logger.js'
import logger from '#utils/logger.js';

// Instead of: import { AppError } from '../../middlewares/errorHandler.js'
import { AppError } from '#middlewares/errorHandler.js';
```

### Package Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run dev:staging` | Start server with staging environment |
| `npm run dev:prod` | Start server with production environment |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:ui` | Run tests with UI |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Lint code |
| `npm run lint:fix` | Lint and fix code |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## 🛠️ Development

### Development Server

```bash
# Start with hot reload
npm run dev

# Start with specific environment
npm run dev:staging
npm run dev:prod
```

### Code Quality

The project includes automated code quality tools:

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files

### Pre-commit Hooks

Automatic checks run before each commit:
- TypeScript compilation
- ESLint linting
- Prettier formatting
- Test execution

## 🌐 API Endpoints

### Core Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/` | Health check endpoint | General |
| `GET` | `/error` | Test error handling | General |
| `GET` | `/slow` | Test slow request monitoring | General |

### Rate Limited Endpoints

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| `GET` | `/limiter/strict` | Strict rate limiting test | 5 req/15min |
| `POST` | `/limiter/auth` | Auth rate limiting test | 10 req/15min |

### Response Format

All endpoints return JSON responses:

```typescript
// Success Response
{
  "message": "Success message",
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "..." // Only in development
  }
}
```

### Rate Limiting

The application implements multiple rate limiting strategies:

- **General Limiter**: 100 requests per 15 minutes (production)
- **Development Limiter**: 1000 requests per 15 minutes
- **Strict Limiter**: 5 requests per 15 minutes
- **Auth Limiter**: 10 requests per 15 minutes

Rate limit headers are included in responses:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Remaining requests in window
- `RateLimit-Reset`: Time when the limit resets

## 📊 Logging System

The application features a comprehensive logging system built with Winston and Morgan. For detailed information, see [Logging Documentation](docs/logging.md).

### Key Features

- **Multi-level Logging**: error, warn, info, http, debug
- **Daily Log Rotation**: Automatic daily rotation with compression
- **Environment-specific Configuration**: Different log levels per environment
- **Structured Logging**: JSON format for machine readability
- **Performance Monitoring**: Automatic slow request detection
- **Error Context**: Full request context in error logs

### Log Files

```
logs/
├── combined-YYYY-MM-DD.log     # All application logs
├── error-YYYY-MM-DD.log        # Error logs only
└── *.log.gz                    # Compressed historical logs
```

### Usage Examples

```typescript
import logger from '#utils/logger.js';

// Different log levels
logger.error('Critical error', { error: err, context: 'user-action' });
logger.warn('Warning condition', { threshold: 85, current: 90 });
logger.info('Operation completed', { userId: 123, duration: '245ms' });
logger.debug('Debug information', { query: 'SELECT * FROM users' });
```

## 🧪 Testing

The project uses Vitest for fast and modern testing:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run coverage
```

### Test Structure

```typescript
// src/__tests__/sum.spec.ts
import { describe, expect, it } from 'vitest';
import { sum } from '#utils/sum.js';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Setup

1. **Create production environment file**
   ```bash
   NODE_ENV=production
   PORT=3000
   ```

2. **Set up log directory**
   ```bash
   mkdir -p logs
   chmod 755 logs
   ```

3. **Configure reverse proxy** (nginx example)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker Deployment

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/
COPY .env.production ./

# Create logs directory
RUN mkdir -p logs

EXPOSE 3000

CMD ["npm", "start"]
```

### Process Management

Use PM2 for production process management:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/server.js --name "express-app"

# Monitor
pm2 monit

# View logs
pm2 logs express-app
```

## 🔧 Customization

### Adding New Routes

```typescript
// src/routes/users.ts
import { Router } from 'express';
import { asyncHandler } from '#middlewares/errorHandler.js';
import logger from '#utils/logger.js';

const router = Router();

router.get('/users/:id', asyncHandler(async (req, res) => {
  logger.info('User requested', { userId: req.params.id });
  
  // Your logic here
  const user = await getUserById(req.params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json({ user });
}));

export default router;
```

### Custom Middleware

```typescript
// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '#middlewares/errorHandler.js';
import logger from '#utils/logger.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    logger.warn('Unauthorized access attempt', { ip: req.ip, url: req.url });
    throw new AppError('Access denied. No token provided.', 401);
  }
  
  // Verify token logic here
  next();
};
```

### Environment-specific Configuration

```typescript
// src/config/database.ts
const config = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_dev'
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## 📈 Monitoring and Analytics

### Log Analysis

```bash
# View recent logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# Filter error logs
grep '"level":"error"' logs/combined-*.log

# Analyze request patterns
grep '"method"' logs/combined-*.log | jq -r '"\(.method) \(.url)"' | sort | uniq -c

# Monitor slow requests
grep "Slow request" logs/combined-*.log
```

### Health Checks

```bash
# Basic health check
curl http://localhost:3000/

# Test error handling
curl http://localhost:3000/error

# Test performance monitoring
curl http://localhost:3000/slow
```

### Metrics Collection

Consider integrating with monitoring services:

- **Application Performance Monitoring (APM)**
  - New Relic
  - Datadog
  - Application Insights

- **Log Aggregation**
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Splunk
  - CloudWatch Logs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all CI checks pass

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [Winston](https://github.com/winstonjs/winston) - Universal logging library
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at scale
- [Vitest](https://vitest.dev/) - Fast unit test framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/anand-jaiswal-IN/express-standard-template2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/anand-jaiswal-IN/express-standard-template2/discussions)
- **Documentation**: [docs/](docs/)

---

**Happy coding! 🚀**