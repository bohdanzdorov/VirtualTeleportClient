import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import html2canvas from 'html2canvas';
import { Html } from '@react-three/drei';
export default function WebpageTexture({ position, rotation, scale, url }) {


  return (
    <Html style={{ userSelect: 'none' }} castShadow receiveShadow occlude="blending" transform position={position} rotation={rotation} scale={scale}>
          <iframe title="embed" width={620} height={350} src={url} frameBorder={0} />
    </Html>
  );
}
