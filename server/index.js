import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
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

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Your OTP for Article Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Article Management OTP</h2>
          <p>Your one-time password is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
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
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    
    if (storedOTP.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // OTP is valid, generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    otpStore.delete(email);
    
    // Store session (in production, use proper session management)
    otpStore.set(`session_${sessionToken}`, {
      authenticated: true,
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({ success: true, token: sessionToken });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OTP Server running', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Verify session middleware
function verifySession(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  const session = otpStore.get(`session_${token}`);
  
  if (!session || Date.now() > session.expires) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
  
  next();
}

// Get all articles
app.get('/api/articles', async (req, res) => {
  try {
    const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
    
    try {
      const data = await fs.readFile(articlesPath, 'utf8');
      const articles = JSON.parse(data);
      res.json({ success: true, articles });
    } catch (error) {
      // If file doesn't exist, return empty array
      res.json({ success: true, articles: [] });
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch articles' });
  }
});

// Save article (requires authentication)
app.post('/api/articles', verifySession, async (req, res) => {
  try {
    const article = req.body;
    const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
    
    // Read existing articles
    let articles = [];
    try {
      const data = await fs.readFile(articlesPath, 'utf8');
      articles = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }
    
    // Add or update article
    if (article.id) {
      // Update existing
      const index = articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        articles[index] = article;
      } else {
        articles.push(article);
      }
    } else {
      // Add new
      article.id = Date.now();
      article.slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      article.date = new Date().toISOString().split('T')[0];
      articles.push(article);
    }
    
    // Ensure data directory exists
    const dataDir = path.dirname(articlesPath);
    await fs.mkdir(dataDir, { recursive: true });
    
    // Save articles
    await fs.writeFile(articlesPath, JSON.stringify(articles, null, 2));
    
    res.json({ success: true, article });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ success: false, message: 'Failed to save article' });
  }
});

// Delete article (requires authentication)
app.delete('/api/articles/:id', verifySession, async (req, res) => {
  try {
    const { id } = req.params;
    const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
    
    // Read existing articles
    const data = await fs.readFile(articlesPath, 'utf8');
    let articles = JSON.parse(data);
    
    // Remove article
    articles = articles.filter(a => a.id !== parseInt(id));
    
    // Save articles
    await fs.writeFile(articlesPath, JSON.stringify(articles, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ success: false, message: 'Failed to delete article' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
