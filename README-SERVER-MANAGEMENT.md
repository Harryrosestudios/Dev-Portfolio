# On-Demand OTP Server Management

This system allows you to start the OTP authentication server only when needed, saving system resources by not running it 24/7.

## How It Works

1. **Server Controller**: A lightweight service that manages the OTP server lifecycle
2. **Frontend Integration**: The frontend automatically starts/stops the server during authentication
3. **Resource Optimization**: The OTP server only runs during authentication flows

## Setup Instructions

### 1. Install Server Controller Dependencies

```bash
cd server-controller
npm install
```

### 2. Start the Server Controller

The server controller must be running to manage the OTP server. Start it with:

```bash
cd server-controller
npm start
```

The controller runs on port 3000 and manages the OTP server on port 3001.

### 3. Use the System

1. Navigate to `/publications/auth` in your frontend
2. Click "🚀 Start Server & Send OTP"
3. The system will:
   - Start the authentication server
   - Wait for it to be ready
   - Send the OTP email
   - Show server status indicators
4. Enter your OTP code
5. After successful verification, the server automatically stops

## Architecture

```
Frontend (React)
      ↓
Server Controller (Port 3000)
      ↓
OTP Server (Port 3001) - Started/Stopped on demand
```

## Server Status Indicators

The frontend shows real-time server status:
- 🔵 **Starting**: Server is booting up
- 🟢 **Running**: Server is ready and processing requests  
- 🟡 **Stopping**: Server is shutting down

## Benefits

- **Resource Efficient**: OTP server only runs when needed
- **Automatic Management**: No manual server start/stop required
- **Visual Feedback**: Clear status indicators for user
- **Graceful Shutdown**: Server stops after successful authentication

## Troubleshooting

### Controller Not Running Error
If you see "Please start the server controller first", make sure to:
1. `cd server-controller`
2. `npm install` (first time only)
3. `npm start`

### Server Failed to Start
- Check if port 3001 is available
- Verify your environment variables are set
- Check server controller logs for errors

### Network Timeouts
- Ensure both controller (3000) and server (3001) ports are accessible
- Check firewall settings if applicable

## Environment Variables

Make sure these are set in your main server `.env` file:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=your-from-email
OTP_RECIPIENT=your-email@domain.com
```

## Development

To modify the server management system:
- **Frontend logic**: `src/sections/PublicationAuth.jsx`
- **Server manager**: `src/utils/serverManager.js`
- **Controller service**: `server-controller/index.js`
