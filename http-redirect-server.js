import http from 'http';
import express from 'express';

const app = express();
const PORT = 9000;

// Redirect all HTTP traffic to HTTPS
app.use((req, res) => {
  const host = req.get('host');
  // Remove port from host if it's there, then add :9001
  const cleanHost = host.split(':')[0];
  res.redirect(301, `https://${cleanHost}:9001${req.url}`);
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🔄 HTTP Redirect Server running on http://harryrose.dev:${PORT}`);
  console.log(`➡️  Redirecting all traffic to https://harryrose.dev:9001`);
});
