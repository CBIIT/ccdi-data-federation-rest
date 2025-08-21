const request = require('supertest');
const app = require('../app');

describe('Sample Endpoints', () => {
  describe('GET /api/v1/sample', () => {
    it('returns list with pagination and Link header', async () => {
      const res = await request(app)
        .get('/api/v1/sample?page=1&per_page=1')
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body).toHaveProperty('data');
      expect(res.body.pagination).toEqual(expect.objectContaining({ page:1, per_page:1 }));
      expect(res.headers).toHaveProperty('link');
    });
    it('rejects unknown filter', async () => {
      const res = await request(app)
        .get('/api/v1/sample?foobar=1')
        .expect(422);
      expect(res.body.errors[0].kind).toBe('InvalidParameters');
      expect(res.body.errors[0].parameters).toContain('foobar');
    });
  });

  describe('GET /api/v1/sample/by/:field/count', () => {
    it('rejects unsupported field', async () => {
      const res = await request(app)
        .get('/api/v1/sample/by/invalid_field/count')
        .expect(422);
      expect(res.body.errors[0].kind).toBe('UnsupportedField');
    });
    it('returns counts for supported field', async () => {
      const res = await request(app)
        .get('/api/v1/sample/by/disease_phase/count')
        .expect(200);
      expect(res.body).toHaveProperty('field','disease_phase');
      expect(Array.isArray(res.body.counts)).toBe(true);
    });
  });
});
