module.exports = function handbookUxPlugin() {
  return {
    name: 'handbook-ux',
    getClientModules() {
      return [require.resolve('./client'), require.resolve('./base-links')];
    },
  };
};
