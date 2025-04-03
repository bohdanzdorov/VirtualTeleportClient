import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { Text } from "@react-three/drei";

export default function WebCamTV({ position, rotation, scale, stream, isActive, onSelect }) {
  const videoRef = useRef(document.createElement("video"));
  const textureRef = useRef(new THREE.VideoTexture(videoRef.current));
  const materialRef = useRef();

  useEffect(() => {
    if (isActive && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      textureRef.current.needsUpdate = true;
    }
  }, [stream, isActive]);

  useFrame(() => {
    if (textureRef.current && isActive) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale} >
      <planeGeometry args={[1.2, 0.7]} />
      {isActive ? (
        <meshBasicMaterial
          ref={materialRef}
          map={textureRef.current}
          transparent={true}
          opacity={0.7}
          depthWrite={false}
          alphaTest={0.5}
          toneMapped={false}
        />
      ) : (
        <>
        <meshBasicMaterial color="black" opacity={0.8} transparent />
        <Text
          position={[0, 0, 0.01]} // Slightly in front of the screen
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          onClick={onSelect} // Click to activate the TV
          onPointerOver={(e) => (e.object.material.color.set("yellow"))} // Hover effect
          onPointerOut={(e) => (e.object.material.color.set("white"))}
        >
          Select
        </Text>
        </>
        
      )}
    </mesh>
  );
}
