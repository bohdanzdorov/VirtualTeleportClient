import { useRef, useState } from "react";
import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { MathUtils, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { socket } from "./SocketManager"
import { Woman } from "./Woman";
import { Man } from "./Man";

//helping function
const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

//helping function
const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = (props) => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 0.45, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 0.55, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(6),
        min: degToRad(0.1),
        max: degToRad(10),
        step: degToRad(0.1),
      },
    }
  );
  const rb = useRef();
  const container = useRef();
  const character = useRef();

  const [animation, setAnimation] = useState("idle")

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();


  useFrame(({ camera }) => {
    if (rb.current && props.isMovementAllowed) {
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1;
      }
      if (get().backward) {
        movement.z = -1;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      if (get().left) {
        movement.x = 1;
      }
      if (get().right) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        if (speed === RUN_SPEED) {
          setAnimation("CharacterArmature|Run")
        } else {
          setAnimation("CharacterArmature|Walk")
        }
      } else {
        setAnimation("CharacterArmature|Idle")
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      rb.current.setLinvel(vel, true);

      container.current.rotation.y = MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1
      );

      socket.emit("move", {
        position: [rb.current.translation().x, rb.current.translation().y, rb.current.translation().z],
        animation: animation,
        rotation: character.current.rotation.y,
        linvel: vel,
        containerRotation: container.current.rotation.y
      })
    }

    // CAMERA
    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb}>
      <group ref={container}>
        <group ref={cameraTarget} position-z={1} />
        <group ref={cameraPosition} position-y={0.35} position-x={-0.12} position-z={-0.4} />
        <group ref={character}>   
          {
            props.gender === "male" ?
              <Man scale={0.27} position-y={-0.25} animation={animation}
                hairColor={props.hairColor}
                suitColor={props.suitColor}
                trousersColor={props.trousersColor} />
              :
              <Woman scale={0.27} position-y={-0.25} animation={animation}
                hairColor={props.hairColor}
                suitColor={props.suitColor}
                trousersColor={props.trousersColor} />
          }
        </group>
      </group>
      <CapsuleCollider args={[0.21, 0.07]} />
    </RigidBody>
  );
};