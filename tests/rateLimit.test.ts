import app from '#app.js';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock console to avoid noise during tests
vi.spyOn(console, 'warn').mockImplementation(() => {
  /* mock warn */
});
vi.spyOn(console, 'info').mockImplementation(() => {
  /* mock info */
});
vi.spyOn(console, 'error').mockImplementation(() => {
  /* mock error */
});

describe('Rate Limiting Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test strictLimiter (max 5 requests per 15 min)
  it('should block requests after exceeding strictLimiter', async () => {
    let lastResponse: request.Response | undefined;

    // Send 6 requests → 5 allowed, 6th blocked
    for (let i = 0; i < 6; i++) {
      lastResponse = await request(app).get('/limiter/strict');
    }

    // Expect 6th request to be blocked
    expect(lastResponse?.status).toBe(429);
    expect(lastResponse?.body).toHaveProperty(
      'error',
      'Too many requests from this IP, please try again later.'
    );
  });

  // Test authLimiter (max 10 requests per 15 min)
  it('should block requests after exceeding authLimiter', async () => {
    let lastResponse: request.Response | undefined;

    // Send 11 requests → 10 allowed, 11th blocked
    for (let i = 0; i < 11; i++) {
      lastResponse = await request(app).post('/limiter/auth');
    }

    // Expect 11th request to be blocked
    expect(lastResponse?.status).toBe(429);
    expect(lastResponse?.body).toHaveProperty(
      'error',
      'Too many authentication attempts, please try again later.'
    );
  });

  // Test generalLimiter (default 100 requests)
  it('should allow multiple requests under generalLimiter', async () => {
    const responses: request.Response[] = await Promise.all(
      Array.from({ length: 5 }, () => request(app).get('/'))
    );

    for (const res of responses) {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Hello Express!');
    }
  });
});
