import * as React from 'react';

export const KrowneLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13 10c3.47-.47 6.36-1.5 8-3.5-2.04 1.7-4.5 3-7.5 3.5" />
    <path d="M13 14c3.47.47 6.36 1.5 8 3.5-2.04-1.7-4.5-3-7.5-3.5" />
    <path d="M5.1 4.2C3.1 5.7 2 7.8 2 10c0 2.2 1.1 4.3 3.1 5.8" />
    <path d="M16 4.2c-2 1.5-3.5 3.7-4.2 6.3" />
    <path d="M11.8 13.5c.7 2.6 2.2 4.8 4.2 6.3" />
    <path d="M19.1 12.5c.5-2.5 1-5 1-7.5" />
    <path d="M19.1 11.5c.5 2.5 1 5 1 7.5" />
    <path d="M3 10c2.5-.5 5-1.7 7-3.5" />
    <path d="M3 14c2.5.5 5 1.7 7 3.5" />
  </svg>
);
