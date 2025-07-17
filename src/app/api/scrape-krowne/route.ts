
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { seriesOptions } from '@/lib/types';
import type { ProductSpecification } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get('sku');

  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
  }

  const url = `https://krowne.com/product/${sku}/`;

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return NextResponse.json({ error: `Product with SKU '${sku}' not found on Krowne.com.` }, { status: 404 });
        }
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Product Name
    const name = $('h1.product_title.entry-title').text().trim();

    // Extract Description (short)
    const description = $('.woocommerce-product-details__short-description').text().trim();
    
    // Extract Specifications and Series
    const specifications: ProductSpecification[] = [];
    let series: (typeof seriesOptions)[number] | undefined = undefined;

    $('#tab-specifications table tr').each((i, el) => {
        const key = $(el).find('th').text().trim();
        const value = $(el).find('td').text().trim();

        if (key && value) {
            if (key.toLowerCase() === 'series' && seriesOptions.includes(value as any)) {
                 series = value as (typeof seriesOptions)[number];
            } else {
                 specifications.push({ key, value });
            }
        }
    });

    return NextResponse.json({
        name,
        description,
        series,
        specifications
    });

  } catch (error) {
    console.error(`Error scraping SKU ${sku}:`, error);
    return NextResponse.json({ error: 'An internal server error occurred while scraping.', details: (error as Error).message }, { status: 500 });
  }
}

    