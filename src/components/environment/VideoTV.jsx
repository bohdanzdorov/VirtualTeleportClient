import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export const VideoTV = ({ position, rotation, scale, stream, videoUrl, isActive, onSelect }) => {
  const videoRef = useRef(document.createElement("video"));
  const textureRef = useRef(null);
  const materialRef = useRef();

  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    video.crossOrigin = "anonymous"; // if needed
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    if (isActive) {
      if (stream) {
        video.srcObject = stream;
      } else if (videoUrl) {
        video.src = videoUrl;
      }

      video.play().then(() => {
        textureRef.current = new THREE.VideoTexture(video);
        textureRef.current.minFilter = THREE.LinearFilter;
        textureRef.current.magFilter = THREE.LinearFilter;
        textureRef.current.format = THREE.RGBFormat;
      });
    }

    return () => {
      video.pause();
    };
  }, [stream, videoUrl, isActive]);

  useFrame(() => {
    if (textureRef.current && isActive) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.2, 0.7]} />
      {isActive && isReady ? (
        <meshBasicMaterial
          ref={materialRef}
          map={textureRef.current}
          toneMapped={false}
        />
      ) : (
        <>
          <meshBasicMaterial color="black" opacity={0.8} transparent />
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            onClick={onSelect}
            onPointerOver={(e) => e.object.material.color.set("yellow")}
            onPointerOut={(e) => e.object.material.color.set("white")}
          >
            Select
          </Text>
        </>
      )}
    </mesh>
  );
}
