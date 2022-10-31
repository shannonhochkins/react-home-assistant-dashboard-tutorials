import React from 'react';
import { useEntity, useHass } from '@hooks';


export function LivingRoom() {
  const { callSwitch, callLight } = useHass();
  const downlights = useEntity('switch.office_downlights');
  console.log('downlights', downlights);
  return <div><button onClick={() => {
    callLight('light.all_office_downlights', 'turn_on', {
      color_temp: 395
    })
    callSwitch('switch.office_downlights');
  }}>TOGGLE DOWNLIGHTS</button> Downlight state: {downlights.state}</div>
}