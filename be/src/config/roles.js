const allRoles = {
  user: ['getIndexes', 'getTransformers', 'createTransformer', 'getSubstations'],
  admin: ['getUsers', 'manageUsers', 'getTransformers', 'createTransformer', 'getIndexes', 'createIndexes', 'getSubstations', 'createSubstation', 'getMeasurementSettings', 'updateMeasurementSettings'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
