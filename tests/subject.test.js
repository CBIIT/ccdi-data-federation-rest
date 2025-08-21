// Integration tests: Subject endpoints
const request = require('supertest');
const app = require('../app');

describe('Subject Endpoints', () => {
  test('list with pagination + Link header', async () => {
    const res = await request(app).get('/api/v1/subject?page=1&per_page=1').expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.headers).toHaveProperty('link');
  });
  test('unknown filter rejected', async () => {
    const res = await request(app).get('/api/v1/subject?unknown=1').expect(422);
    expect(res.body.errors[0].kind).toBe('InvalidParameters');
  });
  test('counts unsupported field', async () => {
    const res = await request(app).get('/api/v1/subject/by/foo/count').expect(422);
    expect(res.body.errors[0].kind).toBe('UnsupportedField');
  });
});
