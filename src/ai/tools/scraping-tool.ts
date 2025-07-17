
'use server';
/**
 * @fileOverview A simple web scraping tool.
 *
 * - scrapeTextTool - A Genkit tool that fetches the text content of a given URL.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const scrapeTextTool = ai.defineTool(
  {
    name: 'scrapeText',
    description: 'Fetches the HTML content of a given URL. Useful for getting information from a webpage.',
    inputSchema: z.string().url(),
    outputSchema: z.string(),
  },
  async (url) => {
    try {
        const response = await fetch(url, {
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            // Throw a clear error message including the status, which the LLM can interpret.
            throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error(`Error in scrapeText tool for URL ${url}:`, error);
        // Re-throw the error so the flow that called the tool can handle it.
        throw error;
    }
  }
);
