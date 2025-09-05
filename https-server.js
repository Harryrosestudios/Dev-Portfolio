import fs from 'fs';
import express from 'express';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SSL Certificate paths
const privateKey = fs.readFileSync('/home/harrybo/.acme.sh/harryrose.dev_ecc/harryrose.dev.key', 'utf8');
const certificate = fs.readFileSync('/home/harrybo/.acme.sh/harryrose.dev_ecc/fullchain.cer', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};

const app = express();
const PORT = 9001;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router (SPA) - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTPS Website Server running on https://harryrose.dev:${PORT}`);
  console.log(`🔒 SSL Certificate loaded successfully`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
});

httpsServer.on('error', (error) => {
  if (error.code === 'EACCES') {
    console.error(`❌ Permission denied on port ${PORT}.`);
  } else if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', error);
  }
});
