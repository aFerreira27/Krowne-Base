
'use server';
/**
 * @fileOverview An AI flow to extract product information from a PDF spec sheet.
 *
 * - populateFromSpecSheet - A function that takes a PDF and returns structured product data.
 * - PopulateFromSpecSheetInput - The input type for the flow.
 * - PopulateFromSpecSheetOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { seriesOptions, allTags } from '@/lib/types';

const PopulateFromSpecSheetInputSchema = z.object({
  specSheetPdf: z
    .string()
    .describe(
      "A product spec sheet as a data URI. It must include a MIME type of 'application/pdf' and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type PopulateFromSpecSheetInput = z.infer<typeof PopulateFromSpecSheetInputSchema>;

const PopulateFromSpecSheetOutputSchema = z.object({
  name: z.string().optional().describe('The full product name, including any series or model numbers.'),
  sku: z.string().optional().describe('The product SKU or model number.'),
  series: z.enum(seriesOptions).optional().describe('The product series, if identifiable.'),
  description: z.string().optional().describe('A brief, one or two sentence marketing description of the product.'),
  standard_features: z.string().optional().describe('A bulleted or paragraph list of the product\'s standard features. Preserve formatting like bullet points.'),
  specifications: z
    .array(
      z.object({
        key: z.string().describe('The name of the specification (e.g., "Width", "Voltage").'),
        value: z.string().describe('The value of the specification (e.g., "36 inches", "120V").'),
      })
    )
    .optional()
    .describe('A list of key-value pairs representing the product\'s technical specifications. Extract every key-value pair you can find, especially from tables.'),
  tags: z.array(z.string()).optional().describe('A list of relevant tags for the product based on its content.'),
});
export type PopulateFromSpecSheetOutput = z.infer<typeof PopulateFromSpecSheetOutputSchema>;


const populatePrompt = ai.definePrompt({
    name: 'populateFromSpecSheetPrompt',
    input: { schema: PopulateFromSpecSheetInputSchema },
    output: { schema: PopulateFromSpecSheetOutputSchema },
    prompt: `You are an expert data entry specialist for a kitchen and bar equipment manufacturer. Your task is to extract detailed information from the provided product specification sheet (PDF) and return it in a structured JSON format.

Analyze the document carefully to identify the following details:

- **name**: The primary product name or title.
- **sku**: The specific model number or SKU for the product.
- **series**: Identify if the product belongs to one of the following series: ${seriesOptions.join(', ')}.
- **description**: A concise summary or marketing overview of the product.
- **standard_features**: A list of the product's main features. If the document has a bulleted list, preserve it.
- **specifications**: This is the most important field. Meticulously extract all technical specifications. Pay very close attention to any tables, lists, or two-column layouts. For each row or item, extract the label as the 'key' and the corresponding data as the 'value'. For example, in a table with "Max Temperature" in the left column and "750 °F" in the right, you must extract it as {"key": "Max Temperature", "value": "750 °F"}. Extract every single key-value pair you can find.
- **tags**: From the list of available tags below, select any that are relevant to the product described in the document.
  Available Tags: ${Array.from(allTags).join(', ')}

If you cannot find information for a specific field, omit it from the output. Do not guess or invent data.

Spec Sheet: {{media url=specSheetPdf}}`,
});

const populateFromSpecSheetFlow = ai.defineFlow(
  {
    name: 'populateFromSpecSheetFlow',
    inputSchema: PopulateFromSpecSheetInputSchema,
    outputSchema: PopulateFromSpecSheetOutputSchema,
  },
  async (input) => {
    const { output } = await populatePrompt(input);
    if (!output) {
      throw new Error("Unable to extract data from the provided spec sheet.");
    }
    return output;
  }
);


export async function populateFromSpecSheet(input: PopulateFromSpecSheetInput): Promise<PopulateFromSpecSheetOutput> {
  return populateFromSpecSheetFlow(input);
}
