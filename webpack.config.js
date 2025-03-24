const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  // Create the default Expo webpack configuration
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Disable static rendering for web build
      staticRendering: false,
    },
    argv
  );

  // Add PWA manifest to assets
  config.plugins.forEach(plugin => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.userOptions.templateParameters = {
        ...plugin.userOptions.templateParameters,
        pwaManifest: '/manifest.json',
      };
    }
  });

  // Return the modified configuration
  return config;
}; 