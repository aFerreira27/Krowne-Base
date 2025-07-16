"use client";

import React, { ElementType, useContext } from 'react';
// import HeadingElementsContext from '@/contexts/heading-elements-context';
import HeadingElementsContext from '@/contexts/heading-elements-context';

const MarkdownLink: ElementType = ({ href, children, ...props }) => {
  console.log('Rendering MarkdownLink');
  const headingElements = useContext(HeadingElementsContext);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      console.log('Link onClick triggered');
      e.preventDefault(); // Prevent default jump behavior
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.substring(1);
        console.log('Attempting to scroll to ID:', id);
        const element = document.getElementById(id); // Use getElementById for now
        if (element) {
          console.log('Element found, scrolling:', element);
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('Element with id not found:', id);
        }
      }
    },
    [] // Empty dependency array since we're not using any external variables
  );

  if (href && href.startsWith('#')) {
    const id = href.substring(1);
    return <a href={href} onClick={handleClick} {...props}>{children}</a>;  }  // For external links, render a standard anchor tag
 return <a href={href} {...props}>{children}</a>;};

export default MarkdownLink;