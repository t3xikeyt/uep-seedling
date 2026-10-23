import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool, { ensureDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'uep-seedling-secret';
let databaseReady = false;

app.use(cors());
app.use(express.json());

const requireDatabase = (req, res, next) => {
  if (!databaseReady) {
    return res.status(503).json({
      message: 'Database is currently unavailable. Start MySQL and try again.',
    });
  }
  return next();
};

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  name: user.name,
});

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (!rows.length) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = sanitizeUser(rows[0]);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

async function initializeDatabase() {
  try {
    await ensureDatabase();

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(60) NOT NULL UNIQUE,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Staff', 'Requester') NOT NULL DEFAULT 'Requester',
        name VARCHAR(120) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_id VARCHAR(20) NOT NULL UNIQUE,
        species_name VARCHAR(100) NOT NULL,
        category VARCHAR(80) NOT NULL,
        origin VARCHAR(120) NOT NULL,
        initial_stock INT NOT NULL DEFAULT 0,
        current_stock INT NOT NULL DEFAULT 0,
        date_logged DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const [userRows] = await pool.query('SELECT COUNT(*) AS total FROM users');
    if (userRows[0].total === 0) {
      const defaultUsers = [
        { username: 'admin', email: 'admin@uep.edu.ph', password: bcrypt.hashSync('123', 10), role: 'Admin', name: 'Clonal Manager' },
        { username: 'staff', email: 'staff@uep.edu.ph', password: bcrypt.hashSync('123', 10), role: 'Staff', name: 'Patrick Seguros' },
        { username: 'requester', email: 'requester@uep.edu.ph', password: bcrypt.hashSync('123', 10), role: 'Requester', name: 'Trixie Agonias' },
      ];

      for (const user of defaultUsers) {
        await pool.query(
          'INSERT INTO users (username, email, password, role, name) VALUES (?, ?, ?, ?, ?)',
          [user.username, user.email, user.password, user.role, user.name]
        );
      }
    }

    const [batchRows] = await pool.query('SELECT COUNT(*) AS total FROM batches');
    if (batchRows[0].total === 0) {
      const defaultBatches = [
        ['001', 'Narra', 'Hardwood', 'UEP Clonal Core', 500, 400, '2026-09-01'],
        ['002', 'Mahogany', 'Hardwood', 'UEP Clonal Core', 500, 300, '2026-09-05'],
        ['003', 'Mangga', 'Fruit-bearing', 'UEP Clonal Core', 100, 80, '2026-09-10'],
      ];

      for (const batch of defaultBatches) {
        await pool.query(
          'INSERT INTO batches (batch_id, species_name, category, origin, initial_stock, current_stock, date_logged) VALUES (?, ?, ?, ?, ?, ?, ?)',
          batch
        );
      }
    }

    databaseReady = true;
    console.log('Database check passed. MySQL is connected.');
    return true;
  } catch (error) {
    databaseReady = false;
    console.warn('Database unavailable. Starting API in degraded mode:', error.message);
    return false;
  }
}

app.get('/api/health', async (req, res) => {
  res.json({
    ok: databaseReady,
    message: databaseReady ? 'UEP Seedling API is running.' : 'Database is offline. Start MySQL to enable full functionality.',
    database: databaseReady ? 'connected' : 'offline',
  });
});

app.post('/api/auth/login', requireDatabase, async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Username/email and password are required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [usernameOrEmail, usernameOrEmail]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/register', requireDatabase, async (req, res) => {
  const { name, username, email, password, role = 'Requester' } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );

    if (existing.length) {
      return res.status(409).json({ message: 'Username or email is already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, hashedPassword, role]
    );

    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

app.get('/api/auth/me', requireDatabase, authMiddleware, async (req, res) => {
  return res.json({ user: req.user });
});

// GET ALL USERS (PARA SA MANAGE STAFF ACCOUNTS)
app.get('/api/users', requireDatabase, authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, username, email, role, created_at FROM users ORDER BY id DESC');
    return res.json(rows);
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ message: 'Unable to fetch users.' });
  }
});

// DELETE USER
// UPDATE USER DETAILS (USERNAME, NAME, EMAIL, ROLE)
app.put('/api/users/:id', requireDatabase, authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, username, email } = req.body;

  if (!name || !username || !email) {
    return res.status(400).json({ message: 'Name, username, and email are required.' });
  }

  try {
    // Check if new username or email is already taken by another user
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ? LIMIT 1',
      [username, email, id]
    );

    if (existing.length) {
      return res.status(409).json({ message: 'Username or email is already in use by another account.' });
    }

    await pool.query(
      'UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?',
      [name, username, email, id]
    );

    const [rows] = await pool.query('SELECT id, name, username, email, role FROM users WHERE id = ?', [id]);
    return res.json({ message: 'Staff details updated successfully.', user: rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Unable to update user.' });
  }
});
app.delete('/api/users/:id', requireDatabase, authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Unable to delete user.' });
  }
});

app.get('/api/batches', requireDatabase, authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM batches ORDER BY id DESC');
    return res.json(rows);
  } catch (error) {
    console.error('Fetch batches error:', error);
    return res.status(500).json({ message: 'Unable to fetch batches.' });
  }
});

app.post('/api/batches', requireDatabase, authMiddleware, async (req, res) => {
  const { species_name, category, origin, quantity, date_logged } = req.body;

  if (!species_name || !category || !origin || !quantity || !date_logged) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM batches WHERE LOWER(species_name) = LOWER(?) AND LOWER(origin) = LOWER(?) LIMIT 1',
      [species_name.trim(), origin.trim()]
    );

    if (existing.length) {
      const current = existing[0];
      const nextQuantity = Number(current.current_stock) + Number(quantity);
      const nextInitial = Number(current.initial_stock) + Number(quantity);

      await pool.query(
        'UPDATE batches SET current_stock = ?, initial_stock = ? WHERE id = ?',
        [nextQuantity, nextInitial, current.id]
      );

      const [updated] = await pool.query('SELECT * FROM batches WHERE id = ?', [current.id]);
      return res.status(200).json({
        message: `Stock updated for ${species_name}.`,
        batch: updated[0],
      });
    }

    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM batches');
    const nextId = String(rows[0].total + 1).padStart(3, '0');

    const [result] = await pool.query(
      'INSERT INTO batches (batch_id, species_name, category, origin, initial_stock, current_stock, date_logged) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nextId, species_name.trim(), category, origin.trim(), quantity, quantity, date_logged]
    );

    const [newBatch] = await pool.query('SELECT * FROM batches WHERE id = ?', [result.insertId]);
    return res.status(201).json({
      message: `New batch ${nextId} created successfully.`,
      batch: newBatch[0],
    });
  } catch (error) {
    console.error('Create batch error:', error);
    return res.status(500).json({ message: 'Unable to save batch.' });
  }
});

app.put('/api/batches/:id', requireDatabase, authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { species_name, category, origin, initial_stock, current_stock, date_logged } = req.body;

  try {
    await pool.query(
      'UPDATE batches SET species_name = ?, category = ?, origin = ?, initial_stock = ?, current_stock = ?, date_logged = ? WHERE id = ?',
      [species_name, category, origin, initial_stock, current_stock, date_logged, id]
    );

    const [rows] = await pool.query('SELECT * FROM batches WHERE id = ?', [id]);
    return res.json({ batch: rows[0] });
  } catch (error) {
    console.error('Update batch error:', error);
    return res.status(500).json({ message: 'Unable to update batch.' });
  }
});

app.delete('/api/batches/:id', requireDatabase, authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM batches WHERE id = ?', [id]);
    return res.json({ message: 'Batch deleted successfully.' });
  } catch (error) {
    console.error('Delete batch error:', error);
    return res.status(500).json({ message: 'Unable to delete batch.' });
  }
});

initializeDatabase().finally(() => {
  const server = app.listen(PORT, () => {
    console.log(`UEP Seedling API started on http://localhost:${PORT}`);
    console.log(databaseReady ? 'Database connected.' : 'Running without database. Start MySQL to enable auth and inventory APIs.');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is already in use. Close the existing server or set a different PORT.`);
    } else {
      console.error('Server error:', error);
    }
  });
});