module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    name: 'TubesBigData',
    themeColor: '#4B3869',
    workboxOptions: {
      skipWaiting: true,
    },
  },
  configureWebpack: {
    optimization: {
      mergeDuplicateChunks: false,
    },
  },
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
  },
  css: {
    // extract: { ignoreOrder: true },
    extract: true,
    // loaderOptions: {
    //   sass: {
    //     additionalData: '@import \'~@/scss/variables\'',
    //   },
    //   scss: {
    //     additionalData: '@import \'~@/scss/variables\';',
    //   },
    // },
  },
};
