
'use server';
/**
 * @fileOverview An AI flow to extract product information from a krowne.com product page.
 *
 * - populateFromKrowneCom - A function that takes a SKU and returns structured product data.
 * - PopulateFromKrowneComInput - The input type for the flow.
 * - PopulateFromKrowneComOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { scrapeTextTool } from '@/ai/tools/scraping-tool';

const PopulateFromKrowneComInputSchema = z.object({
  sku: z.string().describe('The product SKU to look up on krowne.com.'),
});
export type PopulateFromKrowneComInput = z.infer<typeof PopulateFromKrowneComInputSchema>;

const PopulateFromKrowneComOutputSchema = z.object({
  name: z.string().describe('The full product name.'),
  description: z.string().optional().describe('The detailed product description from the page.'),
  specifications: z
    .array(
      z.object({
        key: z.string().describe('The name of the specification (e.g., "Width", "Voltage").'),
        value: z.string().describe('The value of the specification (e.g., "36 inches", "120V").'),
      })
    )
    .optional()
    .describe('A list of key-value pairs representing the product\'s technical specifications. Extract every key-value pair you can find from the specifications table.'),
});
export type PopulateFromKrowneComOutput = z.infer<typeof PopulateFromKrowneComOutputSchema>;

const populatePrompt = ai.definePrompt({
  name: 'populateFromKrowneComPrompt',
  tools: [scrapeTextTool],
  input: { schema: PopulateFromKrowneComInputSchema },
  output: { schema: PopulateFromKrowneComOutputSchema },
  prompt: `You are an expert data entry specialist. Your task is to extract product information from a krowne.com product page.

First, use the scrapeText tool to get the HTML content for the product with SKU '{{{sku}}}'. The URL to use is 'https://krowne.com/product/{{{sku}}}/'. You must call the tool with an object like this: {"url": "THE_URL_STRING"}.

Then, analyze the returned HTML content carefully to identify the following details:

- **name**: The primary product name or title, typically found in an <h1> tag. This is a required field.
- **description**: The main product description, usually found in a div with class 'woocommerce-product-details__short-description'.
- **specifications**: Meticulously extract all technical specifications from the 'Specifications' tab content. The specifications are usually in a table structure within a div with id 'tab-specifications'. For each row, extract the label/header as the 'key' and the corresponding data as the 'value'.

If you cannot find information for a specific field (except for name), omit it from the output. Do not guess or invent data. If the scraper tool fails or returns an error, do not proceed and fail gracefully.
`,
});

const populateFromKrowneComFlow = ai.defineFlow(
  {
    name: 'populateFromKrowneComFlow',
    inputSchema: PopulateFromKrowneComInputSchema,
    outputSchema: PopulateFromKrowneComOutputSchema,
  },
  async (input) => {
    const { output } = await populatePrompt(input);
    if (!output || !output.name) {
      throw new Error(`Unable to extract data from the krowne.com page for SKU '${input.sku}'. It's possible the SKU is invalid or the page structure has changed.`);
    }
    return output;
  }
);


export async function populateFromKrowneCom(input: PopulateFromKrowneComInput): Promise<PopulateFromKrowneComOutput> {
  return populateFromKrowneComFlow(input);
}
