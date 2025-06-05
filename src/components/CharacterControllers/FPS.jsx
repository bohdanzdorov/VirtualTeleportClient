import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
/*
  The component, that add first person controls
  It is used, when the user chooses to cast its video on the monitor
*/
export const FPS = () => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });
  const mouseDown = useRef(false);
  const moveSpeed = 3;

  // Track pressed keys
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Track left mouse button for rotating
  useEffect(() => {
    const down = (e) => {
      if (e.button === 0) mouseDown.current = true;
    };
    const up = (e) => {
      if (e.button === 0) mouseDown.current = false;
    };
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  useFrame((_, delta) => {
    if (controlsRef.current) {
      controlsRef.current.enabled = mouseDown.current;
    }

    const direction = new THREE.Vector3();
    if (keys.current.w) direction.z += 1;
    if (keys.current.s) direction.z -= 1;
    if (keys.current.a) direction.x -= 1;
    if (keys.current.d) direction.x += 1;

    direction.normalize();

    if (direction.length() > 0) {
      const move = new THREE.Vector3();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, camera.up).normalize();

      move.add(forward.multiplyScalar(direction.z));
      move.add(right.multiplyScalar(direction.x));
      move.normalize().multiplyScalar(moveSpeed * delta);

      camera.position.add(move);
    }
  });

  return <PointerLockControls ref={controlsRef} />;
}
