import React from 'react';
import { createRoot } from 'react-dom/client';

import { Authenticate } from './Authenticate';
import { LivingRoom } from '@areas';


const App = () => {
  
  return <>
    <Authenticate>
      <LivingRoom />
    </Authenticate>
  </>;
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);