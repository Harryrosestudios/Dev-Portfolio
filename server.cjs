const express = require('express');
const path = require('path');

const app = express();
const PORT = 9001;
const distPath = path.join(__dirname, 'dist');

// Force images to be served with correct headers
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  setHeaders: (res, filePath) => {
    // Force no-cache for images to ensure they always load
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    // Set proper content type
    if (filePath.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    }
  }
}));

// Serve static files from dist directory
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.includes('/assets/')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }
}));

// Handle React Router (SPA) - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Portfolio server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log(`🖼️  Images served from: ${path.join(distPath, 'assets')}`);
});
