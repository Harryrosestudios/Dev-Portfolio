const express = require('express');
const https = require('https');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// SSL Certificate paths for server.harryrose.dev
const privateKey = fs.readFileSync('/home/harrybo/.acme.sh/server.harryrose.dev_ecc/server.harryrose.dev.key', 'utf8');
const certificate = fs.readFileSync('/home/harrybo/.acme.sh/server.harryrose.dev_ecc/fullchain.cer', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate
};

const app = express();
const PORT = 9002; // Combined HTTPS server on port 9002

app.use(cors());
app.use(express.json());

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// =============================================================================
// OTP FUNCTIONALITY
// =============================================================================

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const otp = generateOTP();
    const email = process.env.OTP_RECIPIENT;
    
    // Store OTP with 10-minute expiration
    otpStore.set(email, {
      code: otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Admin Portal Access Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Admin Portal Access Code</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; border-radius: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;
    const email = process.env.OTP_RECIPIENT;
    
    const storedOTP = otpStore.get(email);
    
    if (!storedOTP) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }
    
    if (Date.now() > storedOTP.expires) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    
    if (storedOTP.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // OTP is valid, remove it from store
    otpStore.delete(email);
    
    // Generate session token (in production, use proper JWT)
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    res.json({ 
      success: true, 
      message: 'OTP verified successfully',
      token: sessionToken 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});

// =============================================================================
// SERVER MANAGEMENT FUNCTIONALITY
// =============================================================================

class ServerManager {
  constructor() {
    this.serverProcess = null;
    this.serverPort = 3001;
    this.serverPath = path.join(__dirname, '..', 'server');
  }

  async isServerRunning() {
    try {
      const response = await fetch(`http://localhost:${this.serverPort}/api/health`);
      return response.status !== 500;
    } catch (error) {
      return false;
    }
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      if (this.serverProcess) {
        resolve(true);
        return;
      }

      console.log('Starting managed server...');
      
      this.killExistingServer().then(() => {
        const nodeCommand = 'node';
        
        this.serverProcess = spawn(nodeCommand, ['index.js'], {
          cwd: this.serverPath,
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: false,
          detached: false
        });

        let resolved = false;
        const startupTimeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            reject(new Error('Server startup timeout'));
          }
        }, 30000);

        this.serverProcess.stdout.on('data', (data) => {
          const output = data.toString();
          console.log('Managed server output:', output);
          
          if ((output.includes('Server running on') || output.includes('listening on')) && !resolved) {
            resolved = true;
            clearTimeout(startupTimeout);
            console.log('Managed Server started successfully');
            resolve(true);
          }
        });

        this.serverProcess.stderr.on('data', (data) => {
          console.error('Managed server error:', data.toString());
        });

        this.serverProcess.on('error', (error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(startupTimeout);
            console.error('Failed to start managed server:', error);
            this.serverProcess = null;
            reject(error);
          }
        });

        this.serverProcess.on('exit', (code) => {
          console.log(`Managed server process exited with code ${code}`);
          this.serverProcess = null;
        });
      });
    });
  }

  async stopServer() {
    return new Promise((resolve) => {
      console.log('Stopping managed server...');
      
      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        
        setTimeout(() => {
          if (this.serverProcess) {
            this.serverProcess.kill('SIGKILL');
          }
          this.serverProcess = null;
          console.log('Managed Server stopped');
          resolve(true);
        }, 3000);
      } else {
        this.killExistingServer().then(() => {
          resolve(true);
        });
      }
    });
  }

  async killExistingServer() {
    return new Promise((resolve) => {
      exec(`lsof -ti:${this.serverPort}`, (error, stdout) => {
        if (stdout) {
          const pids = stdout.trim().split('\n');
          exec(`kill -9 ${pids.join(' ')}`, () => {
            setTimeout(resolve, 1000);
          });
        } else {
          resolve();
        }
      });
    });
  }
}

const serverManager = new ServerManager();

// =============================================================================
// API ENDPOINTS
// =============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Combined HTTPS server running', 
    timestamp: new Date().toISOString(),
    ssl: true,
    domain: 'server.harryrose.dev',
    port: PORT,
    services: ['OTP', 'Server Management']
  });
});

// Start the managed server
app.post('/api/start-server', async (req, res) => {
  try {
    console.log('Received request to start managed server');
    
    const isRunning = await serverManager.isServerRunning();
    if (isRunning) {
      return res.json({ success: true, message: 'Managed server already running' });
    }

    await serverManager.startServer();
    
    // Wait for server to be ready
    let attempts = 0;
    while (attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isReady = await serverManager.isServerRunning();
      if (isReady) {
        return res.json({ success: true, message: 'Managed server started successfully' });
      }
      attempts++;
    }
    
    res.status(500).json({ success: false, message: 'Managed server started but not responding' });
  } catch (error) {
    console.error('Error starting managed server:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stop the managed server
app.post('/api/stop-server', async (req, res) => {
  try {
    console.log('Received request to stop managed server');
    await serverManager.stopServer();
    res.json({ success: true, message: 'Managed server stopped successfully' });
  } catch (error) {
    console.error('Error stopping managed server:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check managed server status
app.get('/api/server-status', async (req, res) => {
  try {
    const isRunning = await serverManager.isServerRunning();
    res.json({ 
      running: isRunning,
      hasProcess: serverManager.serverProcess !== null,
      managedServerPort: serverManager.serverPort
    });
  } catch (error) {
    res.json({ running: false, hasProcess: false });
  }
});

// =============================================================================
// HTTPS SERVER SETUP
// =============================================================================

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`🚀 Combined HTTPS Server running on https://server.harryrose.dev:${PORT}`);
  console.log(`🔒 SSL Certificate loaded successfully`);
  console.log('📊 Available endpoints:');
  console.log(`   GET  https://server.harryrose.dev:${PORT}/api/health`);
  console.log(`   POST https://server.harryrose.dev:${PORT}/api/send-otp`);
  console.log(`   POST https://server.harryrose.dev:${PORT}/api/verify-otp`);
  console.log(`   GET  https://server.harryrose.dev:${PORT}/api/server-status`);
  console.log(`   POST https://server.harryrose.dev:${PORT}/api/start-server`);
  console.log(`   POST https://server.harryrose.dev:${PORT}/api/stop-server`);
  console.log('🔧 Services: OTP Management + Server Management');
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

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down combined HTTPS server...');
  await serverManager.stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down combined HTTPS server...');
  await serverManager.stopServer();
  process.exit(0);
});
