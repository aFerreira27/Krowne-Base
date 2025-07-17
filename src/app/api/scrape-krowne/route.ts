
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { seriesOptions } from '@/lib/types';
import type { ProductSpecification } from '@/lib/types';

/**
 * Fetches and parses the HTML of a given URL.
 * @param url The URL to fetch.
 * @returns A Cheerio instance of the parsed HTML, or null if fetch fails.
 */
async function fetchAndParse(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
        const response = await fetch(url, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            return null; // Return null if the fetch was not successful
        }
        const html = await response.text();
        return cheerio.load(html);
    } catch (error) {
        console.error(`Error fetching URL ${url}:`, error);
        return null;
    }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get('sku');

  if (!sku) {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
  }

  const directUrl = `https://krowne.com/product/${sku}/`;

  try {
    let $ = await fetchAndParse(directUrl);
    
    // If direct URL fails, try searching
    if (!$) {
        return NextResponse.json({ error: `Product with SKU '${sku}' not found on Krowne.com.` }, { status: 404 });
    }

    // Extract Product Name
    const name = $('h1.product_title.entry-title').text().trim();
    
    if (!name) {
       return NextResponse.json({ error: `Product with SKU '${sku}' not found on Krowne.com.` }, { status: 404 });
    }

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
