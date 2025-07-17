"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';
import React from 'react';
import MarkdownLink from './markdown-link';
import ReactMarkdown from 'react-markdown';
import HeadingElementsContext from '../contexts/heading-elements-context';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

interface MarkdownRendererWithScrollProps {
  children: string;
}

const MarkdownRendererWithScroll: React.FC<MarkdownRendererWithScrollProps> = ({ children }) => {
  // Ensure the console log for the children prop is present and clear
  console.log('MarkdownRendererWithScroll received children:', children ? children.substring(0, 200) + '...' : 'No children received');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headingElementsRef = useRef<{ [key: string]: HTMLElement }>({});

  useEffect(() => {
    console.log('useEffect running, containerRef.current:', containerRef.current);

    if (!containerRef.current) {
      console.log('containerRef.current is null, returning');
      return;
    }

    // Add a small delay to ensure ReactMarkdown has finished rendering
    const timeoutId = setTimeout(() => {
      console.log('Setting up MutationObserver after delay');

      const contentObserver = new MutationObserver((mutations) => {
        console.log('MutationObserver callback triggered', mutations);

        mutations.forEach((mutation) => {
          console.log('Mutation type:', mutation.type);
          if (mutation.type === 'childList') {
            console.log('Added nodes:', mutation.addedNodes);
            console.log('Removed nodes:', mutation.removedNodes);

            // Check if any heading elements were added
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
                console.log('Found headings in added node:', headings.length);
              }
            });
          }
        });
      });

      const updateHeadings = () => {
        if (containerRef.current) {
          const headings = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const newHeadingElements: { [key: string]: HTMLElement } = {};
          
          console.log('Found', headings.length, 'headings in container');
          
          headings.forEach(heading => {
            console.log('Processing heading:', heading.tagName, 'text:', heading.textContent?.substring(0, 50));
            if (heading.id) {
              console.log('Heading has ID:', heading.id);
              newHeadingElements[heading.id] = heading as HTMLElement;
            } else {
              console.log('Heading has no ID, generating one');
              // Generate ID from text content if none exists
              const text = heading.textContent || '';
              const id = text.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              if (id) {
                heading.id = id;
                newHeadingElements[id] = heading as HTMLElement;
                console.log('Generated ID:', id);
              }
            }
          });
          
          // Update the ref with all current headings
          headingElementsRef.current = newHeadingElements;
          console.log('Updated heading elements:', Object.keys(newHeadingElements));
        }
      };

      const headingObserver = new MutationObserver((mutations) => {
        console.log('Heading MutationObserver observed mutations:', mutations);
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            shouldUpdate = true;
          }
        });
        if (shouldUpdate) {
          updateHeadings();
        }
      });

      if (containerRef.current) {
        contentObserver.observe(containerRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['id']
        });

        headingObserver.observe(containerRef.current, {
          childList: true,
          subtree: true,
        });

        console.log('Content MutationObserver attached to:', containerRef.current);
        console.log('Heading MutationObserver attached to:', containerRef.current);
        
        // Initial heading update
        updateHeadings();
      }

      // Store observers for cleanup
      return () => {
        contentObserver.disconnect();
        headingObserver.disconnect();
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [containerRef.current]);

  return (
    <HeadingElementsContext.Provider value={headingElementsRef.current}>
      <div ref={containerRef}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeSlug]}
          components={{ a: MarkdownLink as any }}
        >
          {children}
        </ReactMarkdown>
      </div>
    </HeadingElementsContext.Provider>
  );
};

export default MarkdownRendererWithScroll;