
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
        // Fetch with redirect: 'follow' and a common user-agent
        const response = await fetch(url, {
            redirect: 'follow', // Ensure redirects are followed
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        // After following redirects, check the final response URL
        if (response.url !== url && response.status === 200) {
           // Successfully followed a redirect
        } else if (!response.ok) {
            // If the final response is not OK, throw an error
            throw new Error(`HTTP error ${response.status}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error(`Error scraping text from ${url}:`, error);
        if ((error as Error).message.includes('404')) {
             throw new Error('404');
        }
        throw new Error(`Could not scrape content from the provided URL.`);
    }
}
