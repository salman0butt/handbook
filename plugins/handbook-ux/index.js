module.exports = function handbookUxPlugin() {
  return {
    name: 'handbook-ux',
    getClientModules() {
      return [require.resolve('./client')];
    },
  };
};
