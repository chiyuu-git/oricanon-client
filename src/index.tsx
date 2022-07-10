import React from 'react';
import { createRoot } from 'react-dom/client';
import Frame from './layouts/Frame';

const container = document.querySelector('#root')
const root = createRoot(container!); 
root.render(<Frame  />);
