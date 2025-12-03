import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";

export default function TV({ position, rotation, scale, url }) {

  return (
    <Html
      transform
      position={position}
      rotation={rotation}
      scale={scale}
      zIndexRange={[100, 0]} 
    >
      <div
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
