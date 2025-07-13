require('dotenv').config();
const App = require('./app');

process.on('uncaughtException', (error) => {
    throw new Error(`Uncaught Exception: ${  error}`);
});

process.on('unhandledRejection', (reason, promise) => {
    throw new Error(`Unhandled Rejection at: ${  promise  } reason: ${  reason}`);
});

process.on('SIGTERM', () => {
    throw new Error('SIGTERM received, shutting down gracefully');
});

process.on('SIGINT', () => {
    throw new Error('SIGINT received, shutting down gracefully');
});

const app = new App();
app.start(); 