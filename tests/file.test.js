// Integration tests: File endpoints
const request = require('supertest');
const app = require('../app');

describe('File Endpoints', () => {
  test('list basic', async () => {
    const res = await request(app).get('/api/v1/file').expect(200);
    expect(res.body).toHaveProperty('data');
  });
  test('counts valid', async () => {
    const res = await request(app).get('/api/v1/file/by/type/count').expect(200);
    expect(res.body.field).toBe('type');
  });
});
