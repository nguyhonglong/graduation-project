const Joi = require('joi');

const createSubstation = {
    body: Joi.object().keys({
        substationId: Joi.string().required(),
        name: Joi.string().required(),
    }),
};

const getSubstations = {
    query: Joi.object().keys({
      name: Joi.string(),
      substationId: Joi.string()
    }),
  };

module.exports = {
    createSubstation, getSubstations
};
