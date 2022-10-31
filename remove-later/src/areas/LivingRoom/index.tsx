import React from 'react';
import { useHass, useEntity } from '@hooks';

export function LivingRoom() {  
  const { callService }  = useHass();
  const downlight = useEntity('switch.office_downlights');

  console.log('downlight', downlight);
  return <div>Hello from LivingRoom: <button onClick={() => {
    callService({
      domain: 'switch',
      service: 'toggle',
      target: {
        entity_id: 'switch.office_downlights'
      }
    });
  }}>TOGGLE DOWNLIGHT</button> Downlight State: {downlight.state}</div>;
}