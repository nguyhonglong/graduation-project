const Joi = require('joi');

const createTransformer = {
    body: Joi.object().keys({
        transformerId: Joi.string().required(),
        area: Joi.string().required(),
        substation: Joi.string().required(),
        ratedVoltage: Joi.string().required(),
        monitorType: Joi.string().required(),
        name: Joi.string().required(),
        serialnumber: Joi.string().required(),
        alarmState: Joi.string(),
        serviceState: Joi.string(),
        transformerManufacturer: Joi.string(),
        rating: Joi.number().required(), 
    }),
};

const getTransformers = {
    query: Joi.object().keys({
      name: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string()
    }),
  };

module.exports = {
    createTransformer, getTransformers
};
