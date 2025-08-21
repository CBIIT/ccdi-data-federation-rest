// Integration tests: Health & probe endpoints
const request = require('supertest');
const app = require('../app');

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
    });
  });

  describe('GET /health/liveness', () => {
    it('should return alive status', async () => {
      const response = await request(app)
        .get('/health/liveness')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.status).toBe('alive');
    });
  });

  describe('GET /health/readiness', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/health/readiness')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
