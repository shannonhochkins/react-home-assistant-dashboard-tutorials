import React from 'react';
import { createRoot } from 'react-dom/client';

import { Hass } from '@hass';
import { useHass } from '@hooks';
import { LivingRoom } from '@areas';


const App = () => {
  return <>
    <Hass>
      <LivingRoom />
    </Hass>
  </>;
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);