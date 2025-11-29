import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'development.sqlite3');
const db = new Database(dbPath, { readonly: false });

// Enable foreign keys
db.pragma('foreign_keys = ON');

export interface Category {
  id: number;
  name: string;
  description: string | null;
  menu_display: boolean | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category_id: number;
  user_id: number;
  avialability: boolean | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string | null;
  email: string | null;
  password_digest: string | null;
  created_at: string;
  updated_at: string;
}

// Category queries
export const getAllCategories = () => {
  const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
  return stmt.all() as Category[];
};

export const getMenuCategories = () => {
  const stmt = db.prepare('SELECT * FROM categories WHERE menu_display = 1 ORDER BY name');
  return stmt.all() as Category[];
};

export const getCategoryById = (id: number) => {
  const stmt = db.prepare('SELECT * FROM categories WHERE id = ?');
  return stmt.get(id) as Category | undefined;
};

export const createCategory = (name: string, description: string | null, userId: number, menuDisplay: boolean = false) => {
  const stmt = db.prepare(
    'INSERT INTO categories (name, description, user_id, menu_display, created_at, updated_at) VALUES (?, ?, ?, ?, datetime("now"), datetime("now"))'
  );
  const result = stmt.run(name, description, userId, menuDisplay ? 1 : 0);
  return result.lastInsertRowid;
};

export const updateCategory = (id: number, name: string, description: string | null, menuDisplay: boolean) => {
  const stmt = db.prepare(
    'UPDATE categories SET name = ?, description = ?, menu_display = ?, updated_at = datetime("now") WHERE id = ?'
  );
  return stmt.run(name, description, menuDisplay ? 1 : 0, id);
};

export const deleteCategory = (id: number) => {
  // First delete all products in this category
  const deleteProductsStmt = db.prepare('DELETE FROM products WHERE category_id = ?');
  deleteProductsStmt.run(id);

  // Then delete the category
  const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
  return stmt.run(id);
};

// Product queries
export const getAllProducts = () => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY name');
  return stmt.all() as Product[];
};

export const getProductsPaginated = (page: number = 1, limit: number = 50) => {
  const offset = (page - 1) * limit;
  const stmt = db.prepare('SELECT * FROM products ORDER BY name LIMIT ? OFFSET ?');
  return stmt.all(limit, offset) as Product[];
};

export const getTotalProductsCount = () => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const result = stmt.get() as { count: number };
  return result.count;
};

export const getProductsByCategoryId = (categoryId: number) => {
  const stmt = db.prepare('SELECT * FROM products WHERE category_id = ? ORDER BY name');
  return stmt.all(categoryId) as Product[];
};

export const getAvailableProductsByCategoryId = (categoryId: number) => {
  const stmt = db.prepare('SELECT * FROM products WHERE category_id = ? AND avialability = 1 ORDER BY name');
  return stmt.all(categoryId) as Product[];
};

export const getProductById = (id: number) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id) as Product | undefined;
};

export const createProduct = (
  name: string,
  description: string | null,
  price: number,
  categoryId: number,
  userId: number,
  availability: boolean = true,
  photoUrl: string | null = null
) => {
  const stmt = db.prepare(
    'INSERT INTO products (name, description, price, category_id, user_id, avialability, photo_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))'
  );
  const result = stmt.run(name, description, price, categoryId, userId, availability ? 1 : 0, photoUrl);
  return result.lastInsertRowid;
};

export const updateProduct = (
  id: number,
  name: string,
  description: string | null,
  price: number,
  categoryId: number,
  availability: boolean,
  photoUrl: string | null
) => {
  const stmt = db.prepare(
    'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, avialability = ?, photo_url = ?, updated_at = datetime("now") WHERE id = ?'
  );
  return stmt.run(name, description, price, categoryId, availability ? 1 : 0, photoUrl, id);
};

export const deleteProduct = (id: number) => {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  return stmt.run(id);
};

// Find product by name and category
export const getProductByNameAndCategory = (name: string, categoryId: number) => {
  const stmt = db.prepare('SELECT * FROM products WHERE name = ? AND category_id = ?');
  return stmt.get(name, categoryId) as Product | undefined;
};

// Find category by name (case-insensitive)
export const getCategoryByName = (name: string) => {
  const stmt = db.prepare('SELECT * FROM categories WHERE LOWER(name) = LOWER(?)');
  return stmt.get(name) as Category | undefined;
};

// Update product price and availability
export const updateProductPriceAndAvailability = (id: number, price: number, availability: boolean) => {
  const stmt = db.prepare(
    "UPDATE products SET price = ?, avialability = ?, updated_at = datetime('now') WHERE id = ?"
  );
  return stmt.run(price, availability ? 1 : 0, id);
};

// Mark all products as out of stock
export const markAllProductsOutOfStock = () => {
  const stmt = db.prepare("UPDATE products SET avialability = 0, updated_at = datetime('now')");
  return stmt.run();
};

// Slider interface
export interface Slider {
  id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  link_url: string | null;
  order_index: number;
  is_active: boolean | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface FilterDefinition {
  id: number;
  category_id: number;
  filter_name: string;
  filter_type: 'checkbox' | 'radio' | 'range' | 'select';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FilterOption {
  id: number;
  filter_definition_id: number;
  option_value: string;
  display_order: number;
  created_at: string;
}

export interface ProductFilter {
  id: number;
  product_id: number;
  filter_definition_id: number;
  filter_value: string;
  created_at: string;
}

// Slider queries
export const getAllSliders = () => {
  const stmt = db.prepare('SELECT * FROM sliders ORDER BY order_index ASC');
  return stmt.all() as Slider[];
};

export const getActiveSliders = () => {
  const stmt = db.prepare('SELECT * FROM sliders WHERE is_active = 1 ORDER BY order_index ASC');
  return stmt.all() as Slider[];
};

export const getSliderById = (id: number) => {
  const stmt = db.prepare('SELECT * FROM sliders WHERE id = ?');
  return stmt.get(id) as Slider | undefined;
};

export const createSlider = (
  imageUrl: string,
  title: string | null,
  description: string | null,
  linkUrl: string | null,
  orderIndex: number,
  userId: number,
  isActive: boolean = true
) => {
  const stmt = db.prepare(
    "INSERT INTO sliders (image_url, title, description, link_url, order_index, is_active, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  );
  const result = stmt.run(imageUrl, title, description, linkUrl, orderIndex, isActive ? 1 : 0, userId);
  return result.lastInsertRowid;
};

export const updateSlider = (
  id: number,
  imageUrl: string,
  title: string | null,
  description: string | null,
  linkUrl: string | null,
  orderIndex: number,
  isActive: boolean
) => {
  const stmt = db.prepare(
    "UPDATE sliders SET image_url = ?, title = ?, description = ?, link_url = ?, order_index = ?, is_active = ?, updated_at = datetime('now') WHERE id = ?"
  );
  return stmt.run(imageUrl, title, description, linkUrl, orderIndex, isActive ? 1 : 0, id);
};

export const deleteSlider = (id: number) => {
  const stmt = db.prepare('DELETE FROM sliders WHERE id = ?');
  return stmt.run(id);
};

// Filter queries
export const getFiltersByCategory = (categoryId: number) => {
  const stmt = db.prepare(`
    SELECT * FROM filter_definitions
    WHERE category_id = ?
    ORDER BY display_order ASC, filter_name ASC
  `);
  return stmt.all(categoryId) as FilterDefinition[];
};

export const getFilterOptions = (filterDefinitionId: number) => {
  const stmt = db.prepare(`
    SELECT * FROM filter_options
    WHERE filter_definition_id = ?
    ORDER BY display_order ASC, option_value ASC
  `);
  return stmt.all(filterDefinitionId) as FilterOption[];
};

export const getFiltersWithOptions = (categoryId: number) => {
  const filters = getFiltersByCategory(categoryId);
  return filters.map(filter => ({
    ...filter,
    options: getFilterOptions(filter.id)
  }));
};

export const createFilterDefinition = (
  categoryId: number,
  filterName: string,
  filterType: string,
  displayOrder: number = 0
) => {
  const stmt = db.prepare(`
    INSERT INTO filter_definitions (category_id, filter_name, filter_type, display_order)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(categoryId, filterName, filterType, displayOrder);
  return result.lastInsertRowid;
};

export const createFilterOption = (
  filterDefinitionId: number,
  optionValue: string,
  displayOrder: number = 0
) => {
  const stmt = db.prepare(`
    INSERT INTO filter_options (filter_definition_id, option_value, display_order)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(filterDefinitionId, optionValue, displayOrder);
  return result.lastInsertRowid;
};

export const deleteFilterDefinition = (id: number) => {
  const stmt = db.prepare('DELETE FROM filter_definitions WHERE id = ?');
  return stmt.run(id);
};

export const deleteFilterOption = (id: number) => {
  const stmt = db.prepare('DELETE FROM filter_options WHERE id = ?');
  return stmt.run(id);
};

export const setProductFilter = (
  productId: number,
  filterDefinitionId: number,
  filterValue: string
) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO product_filters (product_id, filter_definition_id, filter_value)
    VALUES (?, ?, ?)
  `);
  return stmt.run(productId, filterDefinitionId, filterValue);
};

export const getProductFilters = (productId: number) => {
  const stmt = db.prepare(`
    SELECT pf.*, fd.filter_name, fd.filter_type
    FROM product_filters pf
    JOIN filter_definitions fd ON pf.filter_definition_id = fd.id
    WHERE pf.product_id = ?
  `);
  return stmt.all(productId) as ProductFilter[];
};

export const deleteProductFilter = (productId: number, filterDefinitionId: number) => {
  const stmt = db.prepare(`
    DELETE FROM product_filters
    WHERE product_id = ? AND filter_definition_id = ?
  `);
  return stmt.run(productId, filterDefinitionId);
};

export default db;
