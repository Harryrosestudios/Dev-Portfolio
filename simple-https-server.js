const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');

// SSL Certificate paths
const privateKey = fs.readFileSync('/home/harrybo/.acme.sh/harryrose.dev_ecc/harryrose.dev.key', 'utf8');
const certificate = fs.readFileSync('/home/harrybo/.acme.sh/harryrose.dev_ecc/fullchain.cer', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};

const distPath = path.join(__dirname, 'dist');
const PORT = 9001;

// MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

const server = https.createServer(credentials, (req, res) => {
  let pathname = url.parse(req.url).pathname;
  
  // If pathname is root, serve index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  let filePath = path.join(distPath, pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, serve index.html for SPA routing
      filePath = path.join(distPath, 'index.html');
    }
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      
      const mimeType = getMimeType(filePath);
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTPS Website Server running on https://harryrose.dev:${PORT}`);
  console.log(`🔒 SSL Certificate loaded successfully`);
  console.log(`📁 Serving static files from: ${distPath}`);
});

server.on('error', (error) => {
  if (error.code === 'EACCES') {
    console.error(`❌ Permission denied on port ${PORT}.`);
  } else if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', error);
  }
});
