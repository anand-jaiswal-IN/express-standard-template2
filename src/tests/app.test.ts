import app from '#app.js'; // adjust if path differs
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

// Mock logger to avoid actual console logs during tests
vi.mock('#utils/logger.js', () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn(),
    http: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
  stream: {
    write: vi.fn(),
  },
}));

interface HealthCheckResponse {
  message: string;
  status: string;
  uptime: number;
}

describe('Express App Routes', () => {
  // Home route
  it('GET / should return Hello Express!', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hello Express!');
    expect(res.body).toHaveProperty('timestamp');
  });

  // Health check route
  it('GET /health should return server status', async () => {
    const res = await request(app).get('/health');
    const healthCheckBody = res.body as HealthCheckResponse;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message', 'Server is healthy!');
    expect(typeof healthCheckBody.uptime).toBe('number');
  });

  // Slow route (performance check)
  it('GET /slow should return success message', async () => {
    const res = await request(app).get('/slow');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Slow response completed');
  }, 5000); // Increased timeout for slow route

  // Error route (handled by error middleware)
  it('GET /error should trigger error handler', async () => {
    const res = await request(app).get('/error');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });

  // Strict rate limiter route
  it('GET /limiter/strict should return success message', async () => {
    const res = await request(app).get('/limiter/strict');
    // If rate limit exceeded, expect 429
    expect([200, 429]).toContain(res.status);
  });

  // Auth rate limiter route
  it('POST /limiter/auth should return success message', async () => {
    const res = await request(app).post('/limiter/auth');
    // If rate limit exceeded, expect 429
    expect([200, 429]).toContain(res.status);
  });

  // 404 for unknown routes
  it('GET /unknown should return 404 error', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
