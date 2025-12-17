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
    console.log('[IMPORT] Starting import process');

    // Check authentication - use Bearer token from localStorage
    const authHeader = request.headers.get('authorization');
    console.log('[IMPORT] Auth header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[IMPORT] Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const result = validateSessionToken(token);
    console.log('[IMPORT] Token validation result:', result);

    if (!result.valid) {
      console.error('[IMPORT] Invalid token');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const csvData = body.csvData as string;
    console.log('[IMPORT] CSV data received, length:', csvData?.length || 0);

    if (!csvData) {
      console.error('[IMPORT] No CSV data provided');
      return NextResponse.json(
        { error: 'No CSV data provided' },
        { status: 400 }
      );
    }

    // Parse CSV data (already parsed by papaparse on client)
    let rows: CSVRow[];
    try {
      rows = JSON.parse(csvData);
      console.log('[IMPORT] Parsed rows count:', rows.length);
    } catch (parseError) {
      console.error('[IMPORT] Failed to parse CSV data:', parseError);
      return NextResponse.json(
        { error: 'Invalid CSV data format', details: String(parseError) },
        { status: 400 }
      );
    }

    // Statistics
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    console.log('[IMPORT] Marking all products as out of stock');
    // First, mark all products as out of stock
    try {
      markAllProductsOutOfStock();
      console.log('[IMPORT] Successfully marked all products as out of stock');
    } catch (markError) {
      console.error('[IMPORT] Error marking products out of stock:', markError);
      errors.push(`Failed to mark products out of stock: ${String(markError)}`);
    }

    // Process each row
    console.log('[IMPORT] Starting to process rows');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const categoryName = row.category?.trim();
        const productName = row.name?.trim();
        const priceStr = row.price?.trim();

        console.log(`[IMPORT] Processing row ${i + 1}/${rows.length}:`, { categoryName, productName, priceStr });

        if (!categoryName || !productName || !priceStr) {
          skipped++;
          const error = `Row ${i + 1}: missing data - category: ${categoryName}, name: ${productName}, price: ${priceStr}`;
          console.warn(`[IMPORT] ${error}`);
          errors.push(error);
          continue;
        }

        // Find category
        const category = getCategoryByName(categoryName);
        if (!category) {
          skipped++;
          const error = `Row ${i + 1}: Category not found: "${categoryName}" for product "${productName}"`;
          console.warn(`[IMPORT] ${error}`);
          errors.push(error);
          continue;
        }

        // Parse price
        const price = parseFloat(priceStr);
        if (isNaN(price)) {
          skipped++;
          const error = `Row ${i + 1}: Invalid price for "${productName}": "${priceStr}"`;
          console.warn(`[IMPORT] ${error}`);
          errors.push(error);
          continue;
        }

        // Check if product exists
        const existingProduct = getProductByNameAndCategory(productName, category.id);

        if (existingProduct) {
          // Update existing product: set price and mark as available
          console.log(`[IMPORT] Updating existing product: ${productName} (ID: ${existingProduct.id})`);
          updateProductPriceAndAvailability(existingProduct.id, price, true);
          updated++;
        } else {
          // Create new product with availability = true, user_id = 1 (admin)
          console.log(`[IMPORT] Creating new product: ${productName}`);
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
        const errorMsg = `Row ${i + 1}: Error processing "${row.name}" - ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[IMPORT] ${errorMsg}`, error);
        errors.push(errorMsg);
      }
    }

    console.log('[IMPORT] Processing complete. Stats:', { total: rows.length, created, updated, skipped });

    console.log('[IMPORT] Returning success response');
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
    console.error('[IMPORT] Critical error:', error);
    console.error('[IMPORT] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: 'Import failed',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
