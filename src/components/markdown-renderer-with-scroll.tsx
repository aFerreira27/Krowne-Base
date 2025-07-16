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
const MarkdownRendererWithScroll: React.FC<MarkdownRendererWithScrollProps> = ({ children }) => {
  // Ensure the console log for the children prop is present and clear
  console.log('MarkdownRendererWithScroll received children:', children ? children.substring(0, 200) + '...' : 'No children received');
  const containerRef = useRef<HTMLDivElement>(null);
  const headingElementsRef = useRef<{ [key: string]: HTMLElement }>({});
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
 console.log('MutationObserver observed mutations:', mutations);
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
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
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
