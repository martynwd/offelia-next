#!/usr/bin/env node

/**
 * Initialize slider table in SQLite database
 * Run this script once to create the slider table
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'development.sqlite3');
const db = new Database(dbPath, { readonly: false });

console.log('🔧 Initializing slider table...\n');

try {
  // Create slider table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sliders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      link_url TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      user_id INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  console.log('✅ Slider table created successfully!');

  // Check if we need to insert default slides
  const count = db.prepare('SELECT COUNT(*) as count FROM sliders').get();

  if (count.count === 0) {
    console.log('📸 Adding default slider images...\n');

    const insertSlide = db.prepare(`
      INSERT INTO sliders (image_url, title, order_index, is_active, user_id)
      VALUES (?, ?, ?, 1, 1)
    `);

    insertSlide.run('/slider1.png', 'Холодильник POZIS RK-102', 1);
    insertSlide.run('/slider2.png', 'Стиральная машина ИНДЕЗИТ', 2);
    insertSlide.run('/slider3.png', 'Телевизор BBK 32LEM-1046TS/2C', 3);

    console.log('✅ Added 3 default slides!');
  } else {
    console.log(`ℹ️  Found ${count.count} existing slides, skipping defaults.`);
  }

  console.log('\n✨ Slider table initialization complete!\n');
} catch (error) {
  console.error('❌ Error initializing slider table:', error);
  process.exit(1);
} finally {
  db.close();
}
