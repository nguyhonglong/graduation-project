const allRoles = {
  user: ['getIndexes', 'getTransformers', 'createTransformer'],
  admin: ['getUsers', 'manageUsers', 'getTransformers', 'createTransformer', 'getIndexes', 'createIndexes'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
