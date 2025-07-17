
'use server';
/**
 * @fileOverview A simple web scraping tool.
 *
 * - scrapeText - A function that fetches the text content of a given URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const scrapeTextTool = ai.defineTool(
  {
    name: 'scrapeText',
    description: 'Fetches the text content of a given URL. Useful for getting information from a webpage.',
    inputSchema: z.string().url(),
    outputSchema: z.string(),
  },
  async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    return response.text();
  }
);

export async function scrapeText(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} while fetching ${url}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error scraping text from ${url}:`, error);
        throw new Error(`Could not scrape content from the provided URL. ${(error as Error).message}`);
    }
}
