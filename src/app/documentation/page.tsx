
import { promises as fs } from 'fs';
import path from 'path';
import remarkGfm from 'remark-gfm';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarkdownRendererWithScroll from '@/components/markdown-renderer-with-scroll';
import BackToTopButton from '@/components/back-to-top-button';


export default async function DocumentationPage() {
  const readmePath = path.join(process.cwd(), 'docs', 'README.md');
  const readmeContent = await fs.readFile(readmePath, 'utf-8');

  return (
    <React.Fragment>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Application Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl dark:prose-invert max-w-none">
              <MarkdownRendererWithScroll>
                {readmeContent}
              </MarkdownRendererWithScroll>
            </article>
          </CardContent>
        </Card>
      </div>
      <div id="test-section" style={{ marginTop: '100vh', height: '100px', backgroundColor: 'lightblue' }}>Test Section</div>
      <BackToTopButton />
    </React.Fragment>
  );
}
