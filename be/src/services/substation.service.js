const { Substation } = require('../models');

const createSubstation = async (substationBody) => {
    return Substation.create(substationBody);
};

/**
 * Query for substations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const querySubstations = async () => {
  const substations = await Substation.find();
  return substations;
};

const querySubstationById = async (substationId) => {
  const substation = await Substation.findById(substationId);
  return substation;
};


module.exports = {
    createSubstation,
    querySubstationById,
    querySubstations
};
