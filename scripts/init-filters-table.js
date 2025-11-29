const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'development.sqlite3');
const db = new Database(dbPath);

console.log('Creating filters tables...');

// Create filter_definitions table (defines what filters each category has)
db.exec(`
  CREATE TABLE IF NOT EXISTS filter_definitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    filter_name TEXT NOT NULL,
    filter_type TEXT NOT NULL CHECK(filter_type IN ('checkbox', 'radio', 'range', 'select')),
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, filter_name)
  );
`);

// Create filter_options table (stores available options for each filter)
db.exec(`
  CREATE TABLE IF NOT EXISTS filter_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filter_definition_id INTEGER NOT NULL,
    option_value TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (filter_definition_id) REFERENCES filter_definitions(id) ON DELETE CASCADE
  );
`);

// Create product_filters table (links products to filter options)
db.exec(`
  CREATE TABLE IF NOT EXISTS product_filters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    filter_definition_id INTEGER NOT NULL,
    filter_value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (filter_definition_id) REFERENCES filter_definitions(id) ON DELETE CASCADE,
    UNIQUE(product_id, filter_definition_id)
  );
`);

console.log('Filters tables created successfully!');

// Add example filters for TV category (assuming category_id = 3 for TVs)
const categoryId = 3; // Телевизоры

// Check if category exists
const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(categoryId);

if (category) {
  console.log('Adding example filters for TV category...');

  // Add Manufacturer filter
  const manufacturerFilter = db.prepare(`
    INSERT OR IGNORE INTO filter_definitions (category_id, filter_name, filter_type, display_order)
    VALUES (?, ?, ?, ?)
  `).run(categoryId, 'Производитель', 'checkbox', 1);

  if (manufacturerFilter.changes > 0) {
    const filterId = manufacturerFilter.lastInsertRowid;

    // Add manufacturer options
    const manufacturers = ['Samsung', 'LG', 'BBK', 'ERISSON', 'Philips', 'ASANO', 'VR', 'STARWIND',
                          'SUPRA', 'XIAOMI', 'Polar', 'JVC', 'Manya', 'Yuno', 'Starwind', 'Bq',
                          'Kraft', 'Hyundai', 'Digma'];

    manufacturers.forEach((manufacturer, index) => {
      db.prepare(`
        INSERT OR IGNORE INTO filter_options (filter_definition_id, option_value, display_order)
        VALUES (?, ?, ?)
      `).run(filterId, manufacturer, index);
    });
  }

  // Add Diagonal filter
  const diagonalFilter = db.prepare(`
    INSERT OR IGNORE INTO filter_definitions (category_id, filter_name, filter_type, display_order)
    VALUES (?, ?, ?, ?)
  `).run(categoryId, 'По диагонали', 'checkbox', 2);

  if (diagonalFilter.changes > 0) {
    const filterId = diagonalFilter.lastInsertRowid;

    // Add diagonal options
    const diagonals = ['24', '32', '43', '50', '55', '65', '75'];

    diagonals.forEach((diagonal, index) => {
      db.prepare(`
        INSERT OR IGNORE INTO filter_options (filter_definition_id, option_value, display_order)
        VALUES (?, ?, ?)
      `).run(filterId, diagonal, index);
    });
  }

  console.log('Example filters added successfully!');
} else {
  console.log('TV category (id=3) not found, skipping example data');
}

db.close();
console.log('Done!');
