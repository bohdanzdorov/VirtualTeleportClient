import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

export default function TV({ position, rotation, scale, url }) {
  const [hovering, setHovering] = useState(false);

  // Helper to request pointer lock on click
  useEffect(() => {
    const handleClick = () => {
      if (!document.pointerLockElement) {
        document.body.requestPointerLock();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <Html
      transform
      position={position}
      rotation={rotation}
      scale={scale}
      // zIndexRange={[100, 0]} // Make sure it's on top
    >
      <div
        onMouseEnter={() => {
          document.exitPointerLock();
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
          // Don't call requestPointerLock immediately, browser blocks it unless it's a user gesture
        }}
        style={{
          width: "620px",
          height: "350px",
          border: "4px solid #222",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#000",
          pointerEvents: "auto",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          src={url}
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
          title="YouTube"
          style={{ display: "block" }}
        />
      </div>
    </Html>
  );
}
