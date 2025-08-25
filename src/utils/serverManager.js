class ServerManager {
  constructor() {
    this.controllerPort = 3000;
    this.serverPort = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).port || 3001 : 3001;
    this.controllerUrl = `http://localhost:${this.controllerPort}`;
    this.serverUrl = `http://localhost:${this.serverPort}`;
  }

  // Check if the controller service is running
  async isControllerRunning() {
    try {
      const response = await fetch(`${this.controllerUrl}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Check if the OTP server is running
  async isServerRunning() {
    try {
      const response = await fetch(`${this.serverUrl}/api/articles`);
      return response.status !== 500; // Any response means server is running
    } catch (error) {
      return false;
    }
  }

  // Get server status from controller
  async getServerStatus() {
    try {
      const response = await fetch(`${this.controllerUrl}/server-status`);
      if (response.ok) {
        return await response.json();
      }
      return { running: false, hasProcess: false };
    } catch (error) {
      return { running: false, hasProcess: false };
    }
  }

  // Start the OTP server via controller
  async startServer() {
    try {
      console.log('Requesting server start...');
      
      const response = await fetch(`${this.controllerUrl}/start-server`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Controller request failed: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to start server');
      }

      console.log('Server start request successful');
      return true;
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }

  // Stop the OTP server via controller
  async stopServer() {
    try {
      console.log('Requesting server stop...');
      
      const response = await fetch(`${this.controllerUrl}/stop-server`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Controller request failed: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to stop server');
      }

      console.log('Server stop request successful');
      return true;
    } catch (error) {
      console.error('Failed to stop server:', error);
      throw error;
    }
  }

  // Wait for server to be ready
  async waitForServer(maxAttempts = 15) {
    console.log('Waiting for server to be ready...');
    
    for (let i = 0; i < maxAttempts; i++) {
      if (await this.isServerRunning()) {
        console.log('Server is ready!');
        return true;
      }
      console.log(`Waiting for server... attempt ${i + 1}/${maxAttempts}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Server failed to become ready within timeout period');
  }

  // Ensure controller is running (user needs to start it manually)
  async ensureControllerRunning() {
    const isRunning = await this.isControllerRunning();
    if (!isRunning) {
      throw new Error(
        'Server controller is not running. Please start it by running:\n' +
        'cd server-controller && npm install && npm start'
      );
    }
    return true;
  }
}

export default new ServerManager();
