import React, { useState } from "react";
import { Html } from "@react-three/drei";

export default function TV({ position, rotation, scale, url }) {
  const [allowInteraction, setAllowInteraction] = useState(false);

  return (
    <Html
      style={{
        userSelect: "none",
        pointerEvents: allowInteraction ? "auto" : "none", // Prevents blocking Ecctrl by default
      }}
      castShadow
      receiveShadow
      occlude="blending"
      transform
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <iframe
        title="embed"
        width={620}
        height={350}
        src={url}
        frameBorder={0}
        onMouseEnter={() => {
          document.exitPointerLock(); // Release Ecctrl control
          setAllowInteraction(true); // Allow iframe interaction
        }}
        onMouseLeave={() => {
          setAllowInteraction(false); // Disable interaction
          setTimeout(() => document.body.requestPointerLock(), 100); // Re-enable Ecctrl control
        }}
      />
    </Html>
  );
}
