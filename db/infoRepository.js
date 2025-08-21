function info() {
  return {
    server: {
      version: process.env.npm_package_version || '1.0.0',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
    data: {
      version: 'mock-1.0.0',
      about: 'Mock data layer using in-memory arrays',
    },
  };
}

module.exports = { info };
