const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Import nodemailer
let nodemailer;
try {
  nodemailer = require('nodemailer');
  console.log('✅ Nodemailer loaded successfully');
} catch (error) {
  console.error('❌ Failed to load nodemailer:', error.message);
  process.exit(1);
}

const PORT = 9001;
const distPath = path.join(__dirname, 'dist');

// In-memory OTP storage
const otpStore = new Map();

// SMTP Configuration
const SMTP_CONFIG = {
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: 'harry@harryrose.dev',
    pass: 'uZxk1KvCVwGM'
  }
};

// MIME types
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', 
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
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

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(otp) {
  try {
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    
    // Verify SMTP connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    const mailOptions = {
      from: 'harry@harryrose.dev',
      to: 'harry@harryrose.dev',
      subject: 'Portfolio Admin - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Portfolio Admin Access</h2>
          <p style="font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
            ${otp}
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
}

// Parse POST body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // Add comprehensive CORS and security headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, User-Agent, Referer');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  
  // Handle OPTIONS and HEAD requests
  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (pathname === '/api/send-otp' && req.method === 'POST') {
      try {
        const otp = generateOTP();
        const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        console.log(`📧 Generating OTP: ${otp}`);
        
        // Send email
        await sendOTPEmail(otp);
        
        // Store OTP after successful email send
        otpStore.set('current_otp', { otp, expires });
        
        res.writeHead(200);
        res.end(JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully' 
        }));
        
        console.log(`📧 OTP ${otp} sent successfully and expires in 10 minutes`);
      } catch (error) {
        console.error('❌ Error sending OTP:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ 
          success: false, 
          message: `Failed to send OTP: ${error.message}` 
        }));
      }
      return;
    }
    
    if (pathname === '/api/verify-otp' && req.method === 'POST') {
      try {
        const body = await parseBody(req);
        const { otp } = body;
        
        console.log(`🔍 Verifying OTP: ${otp}`);
        
        const stored = otpStore.get('current_otp');
        
        if (!stored || Date.now() > stored.expires) {
          console.log('❌ OTP expired or not found');
          res.writeHead(400);
          res.end(JSON.stringify({ 
            success: false, 
            message: 'OTP expired or not found' 
          }));
          return;
        }
        
        if (stored.otp === otp) {
          // Generate auth token
          const token = crypto.randomBytes(32).toString('hex');
          
          // Clear used OTP
          otpStore.delete('current_otp');
          
          res.writeHead(200);
          res.end(JSON.stringify({ 
            success: true, 
            token,
            message: 'Authentication successful' 
          }));
          
          console.log('✅ OTP verified successfully');
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Invalid OTP' 
          }));
          console.log(`❌ Invalid OTP: ${otp} (expected: ${stored.otp})`);
        }
      } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        res.writeHead(500);
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Verification failed' 
        }));
      }
      return;
    }
    
    // API route not found
    res.writeHead(404);
    res.end(JSON.stringify({ 
      success: false, 
      message: 'API endpoint not found' 
    }));
    return;
  }

  // Static file serving
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
      
      // Enhanced headers for better browser compatibility
      const headers = { 
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Content-Length': data.length
      };
      
      // Special handling for images to ensure they load properly
      if (pathname.includes('/assets/')) {
        headers['Cache-Control'] = 'public, max-age=31536000'; // 1 year cache for assets
        headers['X-Content-Type-Options'] = 'nosniff';
        headers['Cross-Origin-Resource-Policy'] = 'cross-origin';
        
        // Specific handling for SVGs
        if (pathname.endsWith('.svg')) {
          headers['Content-Type'] = 'image/svg+xml';
          headers['X-Content-Type-Options'] = 'nosniff';
        }
      } else {
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      }
      
      res.writeHead(200, headers);
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Enhanced Combined Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Website: http://0.0.0.0:${PORT}/`);
  console.log(`🔐 OTP API: http://0.0.0.0:${PORT}/api/send-otp`);
  console.log(`🖼️  Images: http://0.0.0.0:${PORT}/assets/`);
  console.log(`📧 OTP emails will be sent to: harry@harryrose.dev`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server error:', error);
  }
});
