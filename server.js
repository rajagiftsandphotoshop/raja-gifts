const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const DATA_FILE = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(require('cors')());

// --- Simple password protection for admin.html ---
const ADMIN_USER = "PSpinder";      // change this username
const ADMIN_PASS = "2331bini2331@";       // change this password

app.get('/admin.html', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }
  const base64 = auth.split(' ')[1] || '';
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials.');
  }
});

// serve frontend
app.use(express.static(path.join(__dirname, 'public')));

async function loadProducts() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === 'ENOENT') {
      await saveProducts([]);
      return [];
    }
    throw e;
  }
}

async function saveProducts(products) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
}

// --- API routes ---
app.get('/api/products', async (req, res) => {
  const products = await loadProducts();
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const products = await loadProducts();
  const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const product = { id: newId, ...req.body };
  products.push(product);
  await saveProducts(products);
  res.json(product);
});

app.put('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const products = await loadProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = { ...products[idx], ...req.body, id };
  await saveProducts(products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  let products = await loadProducts();
  products = products.filter(p => p.id !== id);
  await saveProducts(products);
  res.json({ success: true });
});

// fallback to index.html for SPA-style navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port ' + port));
