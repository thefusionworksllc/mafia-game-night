// Register service worker for PWA functionality
(function() {
  try {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(function(err) {
            // Registration failed
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    } else {
      console.log('Service workers are not supported in this browser');
    }
  } catch (error) {
    console.warn('Error during PWA initialization:', error);
  }
})(); 