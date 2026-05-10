import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

/* ── Directories ── */
// Use Railway volume mount if available, otherwise fall back to local dir
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname
const uploadsDir = path.join(DATA_DIR, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

/* ── Database ── */
const db = new Database(path.join(DATA_DIR, 'orders.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT,
    goal          TEXT,
    height        TEXT,
    weight        TEXT,
    service_type  TEXT,
    address       TEXT,
    date          TEXT,
    time          TEXT,
    notes         TEXT,
    items         TEXT,
    addons        TEXT,
    subtotal      REAL,
    addon_total   REAL,
    total         REAL,
    order_text    TEXT,
    status        TEXT DEFAULT 'new',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS menu_images (
    item_id    INTEGER PRIMARY KEY,
    filename   TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

/* ── Multer ── */
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
    cb(null, `meal-${req.params.itemId}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp|gif|heic)$/i.test(file.mimetype)
    cb(null, ok)
  },
})

/* ── Middleware ── */
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadsDir))
app.use(express.static(__dirname))

/* ════════════════ IMAGE ROUTES ════════════════ */

// GET /api/images — map of { itemId: '/uploads/filename' }
app.get('/api/images', (req, res) => {
  const rows = db.prepare('SELECT item_id, filename FROM menu_images').all()
  const map = {}
  rows.forEach((r) => { map[r.item_id] = `/uploads/${r.filename}` })
  res.json(map)
})

// POST /api/images/:itemId — upload / replace photo
app.post('/api/images/:itemId', upload.single('image'), (req, res) => {
  const { itemId } = req.params
  if (!req.file) return res.status(400).json({ error: 'No image received' })

  const { filename } = req.file

  // Remove old file if exists
  const existing = db.prepare('SELECT filename FROM menu_images WHERE item_id = ?').get(itemId)
  if (existing) {
    try {
      const old = path.join(uploadsDir, existing.filename)
      if (fs.existsSync(old)) fs.unlinkSync(old)
    } catch {}
  }

  db.prepare(`
    INSERT INTO menu_images (item_id, filename) VALUES (?, ?)
    ON CONFLICT(item_id) DO UPDATE SET filename = excluded.filename, updated_at = CURRENT_TIMESTAMP
  `).run(itemId, filename)

  console.log(`[IMAGE] Item #${itemId} → ${filename}`)
  res.json({ success: true, url: `/uploads/${filename}` })
})

// DELETE /api/images/:itemId — remove photo, revert to emoji placeholder
app.delete('/api/images/:itemId', (req, res) => {
  const { itemId } = req.params
  const existing = db.prepare('SELECT filename FROM menu_images WHERE item_id = ?').get(itemId)
  if (existing) {
    try {
      const old = path.join(uploadsDir, existing.filename)
      if (fs.existsSync(old)) fs.unlinkSync(old)
    } catch {}
    db.prepare('DELETE FROM menu_images WHERE item_id = ?').run(itemId)
  }
  res.json({ success: true })
})

/* ════════════════ ORDER ROUTES ════════════════ */

// POST /api/orders — submit order (from React frontend)
app.post('/api/orders', (req, res) => {
  const {
    name, goal, height, weight, serviceType, address,
    date, time, notes, items, addons,
    subtotal, addonTotal, total, orderText,
  } = req.body

  const result = db.prepare(`
    INSERT INTO orders
      (name, goal, height, weight, service_type, address, date, time,
       notes, items, addons, subtotal, addon_total, total, order_text)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name ?? '', goal ?? '', height ?? '', weight ?? '',
    serviceType ?? 'pickup', address ?? '',
    date ?? '', time ?? '', notes ?? '',
    JSON.stringify(items ?? []),
    JSON.stringify(addons ?? {}),
    subtotal ?? 0, addonTotal ?? 0, total ?? 0,
    orderText ?? '',
  )

  console.log(`[ORDER] #${result.lastInsertRowid} — ${name} — $${total}`)
  res.json({ success: true, id: result.lastInsertRowid })
})

// GET /api/orders — list all orders
app.get('/api/orders', (req, res) => {
  const { status } = req.query
  const rows = status && status !== 'all'
    ? db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()

  res.json(rows.map((o) => ({
    ...o,
    items: JSON.parse(o.items || '[]'),
    addons: JSON.parse(o.addons || '{}'),
  })))
})

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', (req, res) => {
  const valid = ['new', 'confirmed', 'preparing', 'ready', 'done', 'cancelled']
  const { status } = req.body
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ success: true })
})

// DELETE /api/orders/:id
app.delete('/api/orders/:id', (req, res) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const today = new Date().toISOString().slice(0, 10)
  const todayRow = db.prepare(
    "SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders WHERE date(created_at)=?"
  ).get(today)
  const pending = db.prepare(
    "SELECT COUNT(*) as count FROM orders WHERE status IN ('new','confirmed','preparing','ready')"
  ).get()
  const allTime = db.prepare(
    "SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders"
  ).get()

  res.json({
    today: { count: todayRow.count, revenue: todayRow.revenue },
    pending: pending.count,
    allTime: { count: allTime.count, revenue: allTime.revenue },
  })
})

/* ── Serve frontend build (production) ── */
const frontendDist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')))
}

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n🥗 FORM Meals Backend`)
  console.log(`   API:    http://localhost:${PORT}/api/orders`)
  console.log(`   Images: http://localhost:${PORT}/api/images`)
  console.log(`   Admin:  http://localhost:${PORT}/admin.html\n`)
})
