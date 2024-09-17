const Joi = require('joi');

const createIndex = {
    body: Joi.object().keys({
        transformer: Joi.required(),
        Hydrogen: Joi.number().required(),
        Methane: Joi.number().required(),
        Acetylene: Joi.number().required(),
        Ethylene: Joi.number().required(),
        Ethane: Joi.number().required(),
        CO2: Joi.number().required(),
        CO: Joi.number().required(),
        O2: Joi.number().required(),
        Water: Joi.number().required(),
        TDCG: Joi.number().required(),
    }),
};

module.exports = {
    createIndex,
};
