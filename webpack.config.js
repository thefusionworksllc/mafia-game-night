// Use require conditionally to avoid errors
let createExpoWebpackConfigAsync;
try {
  createExpoWebpackConfigAsync = require('@expo/webpack-config');
} catch (e) {
  console.warn('Unable to load @expo/webpack-config, using fallback configuration');
  createExpoWebpackConfigAsync = async (env, argv) => {
    // Return a minimal webpack configuration
    return {
      mode: env.mode || 'development',
      entry: './index.js',
      output: {
        path: env.outputPath || __dirname + '/dist',
        filename: 'bundle.js',
      },
      resolve: {
        extensions: ['.js', '.jsx', '.json'],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
    };
  };
}

module.exports = async function (env, argv) {
  // Force disable static rendering
  process.env.EXPO_NO_STATIC_RENDERING = '1';
  
  // Create the webpack configuration
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      staticRendering: false,
    },
    argv
  );

  // Check if we can add the PWA manifest
  try {
    config.plugins.forEach(plugin => {
      if (plugin && plugin.constructor && plugin.constructor.name === 'HtmlWebpackPlugin') {
        plugin.userOptions.templateParameters = {
          ...(plugin.userOptions.templateParameters || {}),
          pwaManifest: '/manifest.json',
        };
      }
    });
  } catch (e) {
    console.warn('Unable to configure PWA manifest:', e.message);
  }

  // Return the modified configuration
  return config;
}; 