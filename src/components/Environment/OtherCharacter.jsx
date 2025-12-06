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

    // Store target and current position for interpolation
    const targetPosRef = useRef(new THREE.Vector3(0, 0, 0));
    const currentPosRef = useRef(new THREE.Vector3(0, 0, 0));
    const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
    const lastPosRef = useRef(new THREE.Vector3(0, 0, 0));
    const updateTimeRef = useRef(Date.now());

    const targetRotRef = useRef([0, 0, 0]);
    const currentRotRef = useRef(new THREE.Euler(0, 0, 0));

    // Lerp speed - adjusted for smooth but responsive movement (kept for rotation smoothing)
    const baseLerpSpeedRef = useRef(0.2);

    // Update target position when props change
    useEffect(() => {
        if (!props.position || !props.rotation) return;

        const now = Date.now();
        const timeSinceUpdate = (now - updateTimeRef.current) / 1000; // seconds

        // Store last position for velocity calculation
        lastPosRef.current.copy(targetPosRef.current);

        // Calculate velocity based on position change over time
        const newPos = new THREE.Vector3(...props.position);
        velocityRef.current = newPos.clone().sub(lastPosRef.current);
        if (timeSinceUpdate > 0) {
            velocityRef.current.divideScalar(timeSinceUpdate);
        }

        targetPosRef.current = newPos;
        targetRotRef.current = props.rotation;
        updateTimeRef.current = now;

        // Adjust lerp speed based on update interval (more frequent updates = lower lerp speed)
        if (timeSinceUpdate > 0.05) {
            baseLerpSpeedRef.current = Math.max(0.15, Math.min(0.25, 1 / (timeSinceUpdate * 60)));
        }
    }, [props.position, props.rotation]);

    // Initialize current position once
    useEffect(() => {
        if (props.position) {
            currentPosRef.current = new THREE.Vector3(...props.position);
        }
    }, []);

    // Every frame, interpolate towards the target position
    useFrame((_, delta) => {
        if (!character.current || !rb.current || !props.position) return;

        // Rotation smoothing remains exponential
        const rotLerp = 1 - Math.exp(-8 * delta);

        const distance = currentPosRef.current.distanceTo(targetPosRef.current);
        const snapThreshold = 2; // meters
        const maxSpeed = 3.5; // m/s cap for catch-up movement
        const maxStep = maxSpeed * delta;

        if (distance > snapThreshold) {
            // Large jump: snap to target to avoid visible rubber-banding
            currentPosRef.current.copy(targetPosRef.current);
        } else if (distance > maxStep) {
            // Move toward target but clamp per-frame distance to avoid overshoot
            const dir = targetPosRef.current.clone().sub(currentPosRef.current).normalize();
            currentPosRef.current.addScaledVector(dir, maxStep);
        } else {
            // Close enough: snap to target
            currentPosRef.current.copy(targetPosRef.current);
        }

        // Interpolate rotation
        const targetQuat = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(...targetRotRef.current)
        );
        const currentQuat = new THREE.Quaternion().setFromEuler(currentRotRef.current);
        currentQuat.slerp(targetQuat, rotLerp);
        currentRotRef.current.setFromQuaternion(currentQuat);

        // Apply interpolated values
        character.current.rotation.x = currentRotRef.current.x;
        character.current.rotation.y = currentRotRef.current.y;
        character.current.rotation.z = currentRotRef.current.z;

        rb.current.setTranslation(currentPosRef.current);
    });

    const hasStream = !!props.stream;

    return (
        <RigidBody
            type="kinematicPosition"
            colliders={false}
            lockRotations
            ref={rb}
            position={props.position || [0, 0, 0]}>
            <group ref={container}>
                <Text
                    position={[0, 0.3, 0]}
                    fontSize={0.03}
                    color="black"
                    anchorX="center"
                    anchorY="bottom"
                >
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
                    {
                        props.gender === "male" ?
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
                            : <Woman
                                scale={1}
                                animation={props.animation}
                                position-y={-0.7}
                                name={props.name}
                                hairColor={props.hairColor}
                                suitColor={props.suitColor}
                                trousersColor={props.trousersColor}
                                hasStream={hasStream}
                            />
                    }
                </group>
            </group>
            <CapsuleCollider args={[0.21, 0.07]} />
        </RigidBody>
    );
}