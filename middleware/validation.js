const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (error) {
      const validationError = new Error(error.details[0].message);
      validationError.name = 'ValidationError';
      validationError.details = error.details;
      return next(validationError);
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  sampleByFieldCount: Joi.object({
    params: Joi.object({
      field: Joi.string()
        .valid('tumor_status', 'anatomic_site', 'tumor_classification', 'tissue_type', 'primary_diagnosis')
        .required()
        .messages({
          'any.only': 'Field must be one of: tumor_status, anatomic_site, tumor_classification, tissue_type, primary_diagnosis',
        }),
    }),
    query: Joi.object({
      limit: Joi.number().integer().min(1).max(1000).default(100),
      offset: Joi.number().integer().min(0).default(0),
    }),
    body: Joi.object(),
  }),
};

module.exports = {
  validateRequest,
  schemas,
};
