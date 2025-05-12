import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

export default function WebCamTV({ position, rotation, stream, isActive, onSelect }) {
  const videoRef = useRef(document.createElement("video"));
  const textureRef = useRef();
  const fixedHeight = 1.15; 
  const [planeSize, setPlaneSize] = useState([2, fixedHeight]); 

  useEffect(() => {
    const video = videoRef.current;
    if (isActive && stream) {
      video.srcObject = stream;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      const handleLoadedMetadata = () => {
        const { videoWidth, videoHeight } = video;
        const aspect = videoWidth / videoHeight;
        const width = fixedHeight * aspect;
        setPlaneSize([width, fixedHeight]);

        textureRef.current = new THREE.VideoTexture(video);
        textureRef.current.needsUpdate = true;
        video.play();
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, [stream, isActive]);

  useFrame(() => {
    if (textureRef.current && isActive) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={planeSize} />
      {isActive && textureRef.current ? (
        <meshBasicMaterial
          map={textureRef.current}
          transparent
          opacity={0.9}
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
