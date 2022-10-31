import React from 'react';
import { createRoot } from 'react-dom/client';

import { Hass } from '@hass';


const App = () => {
  return <>
    <Hass>
      <div>Hello chickens</div>
    </Hass>
    
  </>;
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);