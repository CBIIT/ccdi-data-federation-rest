const fetch = require('node-fetch');
const logger = require('../config/logger');

class GraphQLClient {
  constructor() {
    this.endpoint = process.env.GRAPHQL_URL;
    this.timeout = parseInt(process.env.GRAPHQL_TIMEOUT) || 30000;
    
    if (!this.endpoint) {
      throw new Error('GRAPHQL_URL environment variable is required');
    }
  }

  async query(query, variables = {}) {
    try {
      logger.info('Executing GraphQL query', { 
        query: query.substring(0, 100) + '...', 
        variables 
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'CCDI-REST-Adapter/1.0.0',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        logger.error('GraphQL errors:', result.errors);
        const error = new Error('GraphQL query failed');
        error.name = 'GraphQLError';
        error.graphqlErrors = result.errors;
        throw error;
      }

      logger.info('GraphQL query executed successfully');
      return result.data;
    } catch (error) {
      logger.error('GraphQL client error:', {
        message: error.message,
        stack: error.stack,
        query: query.substring(0, 200),
        variables,
      });

      if (error.name === 'AbortError') {
        const timeoutError = new Error('GraphQL query timeout');
        timeoutError.name = 'TimeoutError';
        throw timeoutError;
      }

      throw error;
    }
  }

  async healthCheck() {
    try {
      const query = `
        query HealthCheck {
          __schema {
            queryType {
              name
            }
          }
        }
      `;
      
      await this.query(query);
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error.message, 
        timestamp: new Date().toISOString() 
      };
    }
  }
}

module.exports = new GraphQLClient();
