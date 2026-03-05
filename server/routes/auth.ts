import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sql from '../config/postgres.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (users.length > 0) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser] = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING *
    `;

    const userId = newUser.id;

    // Send Welcome Email (Optional/Best effort)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"MindVault" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to MindVault',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #6366f1;">Welcome to MindVault, ${name}!</h2>
            <p>Your journey to a more mindful life starts here. We're excited to have you on board.</p>
            <p>Start capturing your thoughts and memories today.</p>
            <br/>
            <p>Stay inspired,<br/>The MindVault Team</p>
          </div>
        `,
      };

      transporter.sendMail(mailOptions).catch(err => console.error('Email error:', err));
    }

    // Generate Token
    const token = jwt.sign({ id: userId, name, email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: userId, name, email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
