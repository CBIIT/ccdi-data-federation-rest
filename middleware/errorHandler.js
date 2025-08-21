const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Domain aware mapping to spec error envelope
  let statusCode = err.statusCode || 500;
  let kind = err.kind || 'InternalServerError';
  let message = err.message || 'Internal server error';
  const extension = {};

  if (err.name === 'ValidationError') {
    statusCode = 422;
    kind = 'InvalidParameters';
    extension.parameters = err.details?.map(d => d.context?.key).filter(Boolean) || [];
  }
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 400; kind = 'InvalidJSON';
  }
  if (err.name === 'GraphQLError') {
    statusCode = 502; kind = 'UpstreamGraphQLError'; extension.upstream = err.graphqlErrors;
  }
  if (err.field) { extension.field = err.field; extension.supported = err.supported; }
  if (err.parameters) extension.parameters = err.parameters;
  if (err.reason) extension.reason = err.reason;
  if (err.entity) { extension.entity = err.entity; extension.id = err.id; }

  const envelope = { errors: [ { kind, message, ...extension } ] };
  if (process.env.NODE_ENV === 'development') envelope.errors[0].stack = err.stack;
  res.status(statusCode).json(envelope);
};

module.exports = errorHandler;
