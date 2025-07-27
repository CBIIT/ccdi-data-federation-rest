// Test setup file
process.env.NODE_ENV = 'test';
process.env.GRAPHQL_URL = 'http://localhost:4000/graphql';
process.env.LOG_LEVEL = 'error';

// Mock Redis for tests
jest.mock('../config/redis', () => ({
  getCache: jest.fn().mockResolvedValue(null),
  setCache: jest.fn().mockResolvedValue(true),
  deleteCache: jest.fn().mockResolvedValue(true),
  initRedis: jest.fn().mockResolvedValue(null),
}));

// Global test timeout
jest.setTimeout(10000);
