const express = require('express');
const { spawn, exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000; // Controller runs on port 3000, main server on 3001

app.use(cors());
app.use(express.json());

class ServerManager {
  constructor() {
    this.serverProcess = null;
    this.serverPort = 3001;
    this.serverPath = path.join(__dirname, '..', 'server');
  }

  async isServerRunning() {
    try {
      const response = await fetch(`http://localhost:${this.serverPort}/api/articles`);
      return response.status !== 500; // Any response means server is running
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

      console.log('Starting OTP server...');
      
      // Kill any existing process first
      this.killExistingServer().then(() => {
        const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        
        this.serverProcess = spawn(npmCommand, ['start'], {
          cwd: this.serverPath,
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
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
          console.log('Server output:', output);
          
          if ((output.includes('Server running on') || output.includes('listening on')) && !resolved) {
            resolved = true;
            clearTimeout(startupTimeout);
            console.log('OTP Server started successfully');
            resolve(true);
          }
        });

        this.serverProcess.stderr.on('data', (data) => {
          console.error('Server error:', data.toString());
        });

        this.serverProcess.on('error', (error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(startupTimeout);
            console.error('Failed to start server:', error);
            this.serverProcess = null;
            reject(error);
          }
        });

        this.serverProcess.on('exit', (code) => {
          console.log(`Server process exited with code ${code}`);
          this.serverProcess = null;
        });
      });
    });
  }

  async stopServer() {
    return new Promise((resolve) => {
      console.log('Stopping OTP server...');
      
      if (this.serverProcess) {
        this.serverProcess.kill('SIGTERM');
        
        setTimeout(() => {
          if (this.serverProcess) {
            this.serverProcess.kill('SIGKILL');
          }
          this.serverProcess = null;
          console.log('OTP Server stopped');
          resolve(true);
        }, 3000);
      } else {
        // Kill any process using port 3001
        this.killExistingServer().then(() => {
          resolve(true);
        });
      }
    });
  }

  async killExistingServer() {
    return new Promise((resolve) => {
      if (process.platform === 'win32') {
        exec(`netstat -ano | findstr :${this.serverPort}`, (error, stdout) => {
          if (stdout) {
            const lines = stdout.split('\n');
            const pids = [];
            lines.forEach(line => {
              const match = line.match(/\s+(\d+)$/);
              if (match) {
                pids.push(match[1]);
              }
            });
            
            if (pids.length > 0) {
              exec(`taskkill /F /PID ${pids.join(' /PID ')}`, () => {
                setTimeout(resolve, 1000);
              });
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        });
      } else {
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
      }
    });
  }
}

const serverManager = new ServerManager();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Controller service running', timestamp: new Date().toISOString() });
});

// Start the OTP server
app.post('/start-server', async (req, res) => {
  try {
    console.log('Received request to start OTP server');
    
    // Check if already running
    const isRunning = await serverManager.isServerRunning();
    if (isRunning) {
      return res.json({ success: true, message: 'Server already running' });
    }

    await serverManager.startServer();
    
    // Wait for server to be ready
    let attempts = 0;
    while (attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isReady = await serverManager.isServerRunning();
      if (isReady) {
        return res.json({ success: true, message: 'Server started successfully' });
      }
      attempts++;
    }
    
    res.status(500).json({ success: false, message: 'Server started but not responding' });
  } catch (error) {
    console.error('Error starting server:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stop the OTP server
app.post('/stop-server', async (req, res) => {
  try {
    console.log('Received request to stop OTP server');
    await serverManager.stopServer();
    res.json({ success: true, message: 'Server stopped successfully' });
  } catch (error) {
    console.error('Error stopping server:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check server status
app.get('/server-status', async (req, res) => {
  try {
    const isRunning = await serverManager.isServerRunning();
    res.json({ 
      running: isRunning,
      hasProcess: serverManager.serverProcess !== null
    });
  } catch (error) {
    res.json({ running: false, hasProcess: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server Controller running on http://localhost:${PORT}`);
  console.log('This service manages the OTP server lifecycle');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down controller...');
  await serverManager.stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down controller...');
  await serverManager.stopServer();
  process.exit(0);
});
