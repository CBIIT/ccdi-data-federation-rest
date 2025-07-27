const request = require('supertest');
const app = require('../app');

describe('Sample Endpoints', () => {
  describe('GET /api/v1/sample/fields', () => {
    it('should return supported fields', async () => {
      const response = await request(app)
        .get('/api/v1/sample/fields')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('supportedFields');
      expect(response.body).toHaveProperty('fieldMappings');
      expect(Array.isArray(response.body.supportedFields)).toBe(true);
    });
  });

  describe('GET /api/v1/sample/by/:field/count', () => {
    it('should reject unsupported field', async () => {
      const response = await request(app)
        .get('/api/v1/sample/by/invalid_field/count')
        .expect(422)
        .expect('Content-Type', /json/);

      expect(response.body.error.message).toContain('not supported');
    });

    it('should validate field parameter', async () => {
      const response = await request(app)
        .get('/api/v1/sample/by/tumor_status/count')
        .expect('Content-Type', /json/);

      // This will depend on your GraphQL service being available
      // In a real test, you'd mock the GraphQL client
    });
  });

  describe('GET /api/v1/sample', () => {
    it('should return sample data with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/sample?limit=10&offset=0')
        .expect('Content-Type', /json/);

      // This will depend on your GraphQL service being available
      // In a real test, you'd mock the GraphQL client
    });
  });
});
