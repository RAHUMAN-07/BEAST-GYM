import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, getOne } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fitpulse_super_secret_jwt_key_2026';

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existingUser = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      'INSERT INTO users (name, email, password_hash, role, is_verified) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), passwordHash, 'user', 1]
    );

    const userId = result.id;
    const token = jwt.sign({ id: userId, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    // Seed default reminder settings
    await run(`INSERT INTO reminders (user_id, reminder_type, time_str) VALUES (?, 'workout', '08:00'), (?, 'water', '11:00'), (?, 'meal', '13:00')`, [userId, userId, userId]);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, name, email, role: 'user' },
      isOnboarded: false
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
    const goal = await getOne('SELECT * FROM goals WHERE user_id = ?', [user.id]);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      isOnboarded: !!(profile && goal),
      profile,
      goal
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Forgot Password Flow
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!user) {
      // Return success for security, but note in response
      return res.json({ message: 'If account exists, password reset instructions have been sent.' });
    }

    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await run('UPDATE users SET reset_token = ? WHERE id = ?', [resetToken, user.id]);

    return res.json({
      message: 'Password reset token generated successfully.',
      resetToken // Demo convenience
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process forgot password.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Token and new password required.' });
    }

    const user = await getOne('SELECT * FROM users WHERE reset_token = ?', [resetToken]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await run('UPDATE users SET password_hash = ?, reset_token = NULL WHERE id = ?', [newHash, user.id]);

    return res.json({ message: 'Password updated successfully. Please log in.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Get Current User Profile Data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getOne('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = await getOne('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
    const goal = await getOne('SELECT * FROM goals WHERE user_id = ?', [user.id]);

    return res.json({
      user,
      isOnboarded: !!(profile && goal),
      profile,
      goal
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

export default router;
