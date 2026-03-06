const express = require('express');
const cors = require('cors');
const automationRoutes = require('./routes/automation.routes');
const contactRoutes = require('./routes/contact.routes');
const {
  port: PORT,
  mongoUri,
  adminNotificationEmail,
  resendApiKey
} = require('./config/env');
const {
  getDatabase,
  closeResources
} = require('./config/database');
const notFoundHandler = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    company: 'Expult Global',
    message: 'Welcome to the Expult Global backend API.'
  });
});

app.get('/api/health', async (_req, res) => {
  const database = await getDatabase();

  res.json({
    status: 'ok',
    company: 'Expult Global',
    message: 'Express backend is running',
    integrations: {
      mongodbConfigured: Boolean(mongoUri),
      mongodbConnected: Boolean(database),
      resendConfigured: Boolean(resendApiKey),
      adminNotificationConfigured: Boolean(adminNotificationEmail)
    }
  });
});

app.get('/api/company', (_req, res) => {
  res.json({
    name: 'Expult Global',
    stage: 'Lead capture foundation active',
    nextStep: 'Drive traffic through the automation experience'
  });
});

app.use('/api/contact', contactRoutes);

app.use('/api/automation-test-drive', automationRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

let server = null;

const startServer = (port = PORT) => {
  if (server) {
    return server;
  }

  server = app.listen(port, () => {
    console.log(`Expult Global backend running on http://localhost:${port}`);
  });

  return server;
};

const closeServer = () =>
  new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      server = null;
      resolve();
    });
  });

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down Expult Global backend.`);
  await closeResources();
  await closeServer();
  process.exit(0);
};

const registerShutdownHandlers = () => {
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      shutdown(signal).catch((error) => {
        console.error('Error during shutdown.', error);
        process.exit(1);
      });
    });
  });
};

if (require.main === module) {
  startServer();
  registerShutdownHandlers();
}

module.exports = {
  app,
  startServer,
  closeResources
};