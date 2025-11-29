import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, getAllProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase().trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ categories: [], products: [] });
  }

  try {
    const allCategories = getAllCategories();
    const allProducts = getAllProducts();

    // Search categories by name
    const matchedCategories = allCategories
      .filter(category =>
        category.name.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limit to 5 categories

    // Search products by name
    const matchedProducts = allProducts
      .filter(product =>
        product.name.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit to 10 products

    return NextResponse.json({
      categories: matchedCategories,
      products: matchedProducts,
      query
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
