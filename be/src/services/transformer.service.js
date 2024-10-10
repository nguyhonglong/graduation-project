const { Transformer } = require('../models');

const createTransformer = async (transformerBody) => {
    return Transformer.create(transformerBody);
};

/**
 * Query for transformers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryTransformers = async () => {
  const transformers = await Transformer.find({}, '_id substation name');
  return transformers;
};

const queryTransformerById = async (id) => {
  const transformer = await Transformer.findById(id);
  return transformer;
};



module.exports = {
    createTransformer,
    queryTransformers,
    queryTransformerById
};
