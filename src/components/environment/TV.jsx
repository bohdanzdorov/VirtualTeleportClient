import React from 'react'
import { Html } from '@react-three/drei';
export default function TV({ position, rotation, scale, url }) {

  return (
    <Html style={{ userSelect: 'none' }} castShadow receiveShadow occlude="blending" transform position={position} rotation={rotation} scale={scale}>
          <iframe title="embed" width={620} height={350} src={url} frameBorder={0} />
    </Html>
  );
}
