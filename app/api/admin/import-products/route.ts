import { NextRequest, NextResponse } from 'next/server';
import { validateSessionToken } from '@/lib/auth';
import {
  getCategoryByName,
  getProductByNameAndCategory,
  createProduct,
  updateProductPriceAndAvailability,
  markAllProductsOutOfStock,
} from '@/lib/db';

interface CSVRow {
  category: string;
  name: string;
  price: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication - use Bearer token from localStorage
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const result = validateSessionToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const csvData = body.csvData as string;

    if (!csvData) {
      return NextResponse.json(
        { error: 'No CSV data provided' },
        { status: 400 }
      );
    }

    // Parse CSV data (already parsed by papaparse on client)
    const rows: CSVRow[] = JSON.parse(csvData);

    // Statistics
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // First, mark all products as out of stock
    markAllProductsOutOfStock();

    // Process each row
    for (const row of rows) {
      try {
        const categoryName = row.category?.trim();
        const productName = row.name?.trim();
        const priceStr = row.price?.trim();

        if (!categoryName || !productName || !priceStr) {
          skipped++;
          errors.push(`Skipped row: missing data - ${JSON.stringify(row)}`);
          continue;
        }

        // Find category
        const category = getCategoryByName(categoryName);
        if (!category) {
          skipped++;
          errors.push(`Category not found: ${categoryName} for product ${productName}`);
          continue;
        }

        // Parse price
        const price = parseFloat(priceStr);
        if (isNaN(price)) {
          skipped++;
          errors.push(`Invalid price for ${productName}: ${priceStr}`);
          continue;
        }

        // Check if product exists
        const existingProduct = getProductByNameAndCategory(productName, category.id);

        if (existingProduct) {
          // Update existing product: set price and mark as available
          updateProductPriceAndAvailability(existingProduct.id, price, true);
          updated++;
        } else {
          // Create new product with availability = true, user_id = 1 (admin)
          createProduct(
            productName,
            null, // description
            price,
            category.id,
            1, // user_id (admin)
            true, // availability
            null // photo_url
          );
          created++;
        }
      } catch (error) {
        skipped++;
        errors.push(`Error processing row ${JSON.stringify(row)}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: rows.length,
        created,
        updated,
        skipped,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: String(error) },
      { status: 500 }
    );
  }
}
