import React from 'react';

const HeadingElementsContext = React.createContext<Record<string, HTMLElement | null>>({});

export default HeadingElementsContext;