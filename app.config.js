const { getDefaultConfig } = require('expo/metro-config');

// Export the app configuration as a function
module.exports = ({ config }) => {
  // Start with the existing app.json configuration
  const existingConfig = { ...config };

  // Customize the configuration
  return {
    ...existingConfig,
    // Disable static rendering for export
    web: {
      ...(existingConfig.web || {}),
      // Explicitly disable static rendering
      staticOptions: {
        enabled: false
      },
      // Other web options from app.json are maintained
    },
    // Make sure expo-router is not used for navigation
    plugins: [
      ...(existingConfig.plugins || []),
      ['expo-router', {
        // Disable router features we're not using
        enabled: false,
      }],
    ],
    // Add extra properties for the build process
    extra: {
      ...(existingConfig.extra || {}),
      // Disable static rendering explicitly
      disableStaticRendering: true,
    },
  };
}; 