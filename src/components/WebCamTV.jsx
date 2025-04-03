import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TV({ position, rotation, scale, stream }) {
  const videoRef = useRef(document.createElement("video")); // Create a video element
  const textureRef = useRef(new THREE.VideoTexture(videoRef.current)); // Create VideoTexture
  const materialRef = useRef();

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      videoRef.current.muted = true; 
      videoRef.current.loop = true;
      textureRef.current.needsUpdate = true;
    }
  }, [stream]);

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true; 
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.2, 0.7]} />
      <meshBasicMaterial 
        ref={materialRef}
        map={textureRef.current}
        transparent={true}  // Enable transparency
        opacity={0.7}       // Adjust transparency level (0 = fully transparent, 1 = fully visible)
        depthWrite={false}  // Prevents rendering issues
        alphaTest={0.5}     // Optional: Makes pixels below 50% opacity fully transparent
        toneMapped={false} 
/>
    </mesh>
  );
}
