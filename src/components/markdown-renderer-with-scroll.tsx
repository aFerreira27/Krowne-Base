"use client";

import { useEffect, useRef, useState, ReactNode } from 'react';
import React from 'react'; // Import React
import MarkdownLink from './markdown-link'; // Import MarkdownLink
import ReactMarkdown from 'react-markdown';
import HeadingElementsContext from '../contexts/heading-elements-context';
import remarkGfm from 'remark-gfm'; // Ensure remarkGfm is imported

interface MarkdownRendererWithScrollProps {
  children: string;
}
const MarkdownRen      contentObserver.disconnect();
      headingObserver.disconnect();
    };
  }, [containerRef.current]);
dererWithScroll: React.FC<MarkdownRendererWithScrollProps> = ({ children }) => {
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

      contentObserver.observe(containerRef.current!, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id']
      });

      console.log('Content MutationObserver attached to:', containerRef.current);

      const headingObserver = new MutationObserver((mutations) => {
        console.log('Heading MutationObserver observed mutations:', mutations);
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && containerRef.current) {
          const headings = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
          const newHeadingElements = new Map<string, HTMLElement>();
          headings.forEach(heading => {
            if (heading.id && !headingElementsRef.current[heading.id]) { // Check if ID exists and not already in ref
              console.log('MutationObserver found heading:', heading.tagName, 'with ID:', heading.id);
              newHeadingElements.set(heading.id, heading as HTMLElement);
            }
          });
          // Update the ref after processing all headings in this mutation
          headingElementsRef.current = Object.fromEntries(newHeadingElements);
        }
      });
    });

    if (containerRef.current) {
 headingObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
 console.log('Heading MutationObserver attached to:', containerRef.current);
    }


    return () => {
      observer.disconnect();
    };
  }, [containerRef.current]);


  return (
    <HeadingElementsContext.Provider value={headingElementsRef.current}>
      <div ref={containerRef}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink as any }}>
          {children}
        </ReactMarkdown>
      </div>
    </HeadingElementsContext.Provider>
  );
};

export default MarkdownRendererWithScroll;
