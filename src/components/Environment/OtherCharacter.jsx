import { useRef, useEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

import { Man } from "./Models/Man";
import { Woman } from "./Models/Woman";
import { Monitor } from "./Models/Monitor";

/*
    Component used to display real-time avatars of other users
    Serves as a wrapper around 3D avatar model
*/
export const OtherCharacter = (props) => {
    const character = useRef();
    const container = useRef();
    const rb = useRef();

    const targetPosRef = useRef(new THREE.Vector3());
    const currentPosRef = useRef(new THREE.Vector3());
    const updateTimeRef = useRef(Date.now());
    const followStrengthRef = useRef(6);

    const targetRotRef = useRef([0, 0, 0]);
    const currentRotRef = useRef(new THREE.Euler());
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!props.position || !props.rotation) return;

        const now = Date.now();
        const timeSinceUpdate = (now - updateTimeRef.current) / 1000;

        targetPosRef.current.set(...props.position);
        targetRotRef.current = props.rotation;
        updateTimeRef.current = now;

        if (!initializedRef.current) {
            currentPosRef.current.copy(targetPosRef.current);
            currentRotRef.current.copy(new THREE.Euler(...props.rotation));
            if (rb.current) {
                rb.current.setTranslation(currentPosRef.current, true);
            }
            initializedRef.current = true;
        }

        if (timeSinceUpdate > 0.016) {
            const followStrength = 1 / Math.max(timeSinceUpdate, 0.016);
            followStrengthRef.current = THREE.MathUtils.clamp(followStrength, 3, 12);
        }
    }, [props.position, props.rotation]);

    useFrame((_, delta) => {
        if (!character.current || !rb.current) return;

        const distance = currentPosRef.current.distanceTo(targetPosRef.current);
        const snapThreshold = 10;

        if (distance > snapThreshold) {
            currentPosRef.current.copy(targetPosRef.current);
        } else {
            const posLerp = 1 - Math.exp(-followStrengthRef.current * delta);
            currentPosRef.current.lerp(targetPosRef.current, posLerp);
        }

        const targetQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(...targetRotRef.current)
        );
        const currentQuat = new THREE.Quaternion().setFromEuler(currentRotRef.current);
        const rotLerp = 1 - Math.exp(-10 * delta);
        currentQuat.slerp(targetQuat, rotLerp);
        currentRotRef.current.setFromQuaternion(currentQuat);

        rb.current.setTranslation(currentPosRef.current, true);

        character.current.rotation.x = currentRotRef.current.x;
        character.current.rotation.y = currentRotRef.current.y;
        character.current.rotation.z = currentRotRef.current.z;
    });

    const hasStream = !!props.stream;

    return (
        <RigidBody
            type="kinematicPosition"
            colliders={false}
            lockRotations
            ref={rb}>
            <group ref={container}>
                <Text
                    position={[0, 0.3, 0]}
                    fontSize={0.03}
                    color="black"
                    anchorX="center"
                    anchorY="bottom">
                    {props.name}
                </Text>

                <group ref={character}>
                    {hasStream && (
                        <Monitor
                            position={[-0.18, 0.79, 0.13]}
                            rotation={[0, -Math.PI, 0]}
                            scale={1}
                            stream={props.stream}
                            isActive={true}
                        />
                    )}
                    {props.gender === "male" ? (
                        <Man
                            scale={1}
                            animation={props.animation}
                            position-y={-0.7}
                            name={props.name}
                            hairColor={props.hairColor}
                            suitColor={props.suitColor}
                            trousersColor={props.trousersColor}
                            hasStream={hasStream}
                        />
                    ) : (
                        <Woman
                            scale={1}
                            animation={props.animation}
                            position-y={-0.7}
                            name={props.name}
                            hairColor={props.hairColor}
                            suitColor={props.suitColor}
                            trousersColor={props.trousersColor}
                            hasStream={hasStream}
                        />
                    )}
                </group>
            </group>
            <CapsuleCollider args={[0.21, 0.07]} />
        </RigidBody>
    );
};