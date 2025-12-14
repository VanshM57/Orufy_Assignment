const app = require('./app');

// Only start the server if this file is run directly (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log('Server running on', PORT));
}
