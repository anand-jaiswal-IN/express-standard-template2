import app from '#app.js';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock console to avoid noisy logs during tests
vi.spyOn(console, 'info').mockImplementation(() => {
  /* mock info */
});
vi.spyOn(console, 'warn').mockImplementation(() => {
  /* mock warn */
});
vi.spyOn(console, 'error').mockImplementation(() => {
  /* mock error */
});

describe('Express App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Home route
  it('should return a welcome message at GET /', async () => {
    const res: request.Response = await request(app).get('/').expect(200);

    expect(res.body).toHaveProperty('message', 'Hello Express!');
    expect(res.body).toHaveProperty('timestamp');
  });

  // Error route (should trigger global error handler)
  it('should return error response at GET /error', async () => {
    const res: request.Response = await request(app).get('/error').expect(500);

    expect(res.body).toHaveProperty('error');
    expect(typeof (res.body as Record<string, unknown>).error).toBe('object');
    expect((res.body as { error: { message: string } }).error.message).toMatch(
      /This is a test error/i
    );
  });

  // Slow route (should delay response but still succeed)
  it('should return a response for slow route at GET /slow', async () => {
    const start = Date.now();
    const res: request.Response = await request(app).get('/slow').expect(200);
    const duration = Date.now() - start;

    expect(res.body).toHaveProperty('message', 'Slow response completed');
    expect(duration).toBeGreaterThanOrEqual(1500); // ensures delay is working
  }, 5000); // increase timeout for this test

  // Health check
  it('should return healthy status at GET /health', async () => {
    const res: request.Response = await request(app).get('/health').expect(200);

    expect(res.body).toHaveProperty('message', 'Server is healthy!');
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof (res.body as Record<string, unknown>).uptime).toBe('number');
  });

  // Strict limiter route (first request should pass)
  it('should allow initial request on /limiter/strict', async () => {
    const res: request.Response = await request(app).get('/limiter/strict').expect(200);
    expect((res.body as Record<string, unknown>).message).toMatch(/strict rate limiting/i);
  });

  // Auth limiter route (first request should pass)
  it('should allow initial request on /limiter/auth', async () => {
    const res: request.Response = await request(app).post('/limiter/auth').expect(200);
    expect((res.body as Record<string, unknown>).message).toMatch(/auth rate limiting/i);
  });

  // 404 route
  it('should return 404 for non-existing routes', async () => {
    const res: request.Response = await request(app).get('/non-existing').expect(404);

    expect(res.body).toHaveProperty('error');
    expect(typeof (res.body as Record<string, unknown>).error).toBe('object');
    expect((res.body as { error: { message: string } }).error.message).toMatch(/not found/i);
  });
});
