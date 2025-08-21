class UnsupportedFieldError extends Error {
  constructor(field, supported) {
    super(`Unsupported field: ${field}`);
    this.name = 'UnsupportedFieldError';
    this.field = field;
    this.supported = supported;
    this.kind = 'UnsupportedField';
    this.statusCode = 422;
  }
}

class InvalidParametersError extends Error {
  constructor(parameters, reason) {
    super(`Invalid parameters: ${parameters.join(', ')}`);
    this.name = 'InvalidParametersError';
    this.parameters = parameters;
    this.reason = reason;
    this.kind = 'InvalidParameters';
    this.statusCode = 422;
  }
}

class NotFoundError extends Error {
  constructor(entity, id) {
    super(`${entity} not found: ${id}`);
    this.name = 'NotFoundError';
    this.entity = entity;
    this.id = id;
    this.kind = 'NotFound';
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message || 'Internal server error');
    this.name = 'InternalServerError';
    this.kind = 'InternalServerError';
    this.statusCode = 500;
  }
}

module.exports = {
  UnsupportedFieldError,
  InvalidParametersError,
  NotFoundError,
  InternalServerError,
};
