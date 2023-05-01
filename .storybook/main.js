const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: {
            auto: /\.module\.scss+$/i,
          },
        },
        sassLoaderOptions: {
          sassOptions: {
            data: '@import "common";',
            includePaths: [path.join(__dirname, '../assets/styles')],
          },
        },
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    return {
      ...config,
      resolve: {
        modules: [path.resolve(__dirname, '../'), 'node_modules'],
      },
    };
  },
};
