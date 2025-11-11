import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";

import { socket } from "../SocketManager";

import { Man } from "../Environment/Models/Man";
import { Woman } from "../Environment/Models/Woman";

export const CharacterController = (props) => {

    const keyboardMap = [
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
        // Optional animation key map
        { name: "action1", keys: ["1"] },
        { name: "action2", keys: ["2"] },
        { name: "action3", keys: ["3"] },
        { name: "action4", keys: ["KeyF"] },
    ];


    const animationSet = {
        idle: "CharacterArmature|Idle",
        walk: "CharacterArmature|Walk",
        run: "CharacterArmature|Run",
        jump: "CharacterArmature|Idle",
        jumpIdle: "CharacterArmature|Idle",
        jumpLand: "CharacterArmature|Idle",
        fall: "CharacterArmature|Idle",
        // Currently support four additional animations
        action1: "CharacterArmature|Idle",
        action2: "CharacterArmature|Idle",
        action3: "CharacterArmature|Idle",
        action4: "CharacterArmature|Wave", // This is special action which can be trigger while walking or running
    };

    const manCharacterURL = 'models/man.glb'
    const womanCharacterURL = 'models/woman.glb'

    const [position, setPosition] = useState([0, 1, 0]);
    const rigidBodyRef = useRef();

    const lastPositionRef = useRef([0, 0, 0]);
    const lastRotationRef = useRef([0, 0, 0]);
    const lastAnimationRef = useRef("CharacterArmature|Idle");

    const EMIT_INTERVAL = 0.5; // Send updates every 1ms
    const curAnimationRef = useRef("CharacterArmature|Idle");
    const characterGroupRef = useRef(null); // Cache the group reference

    // Update animation tracking without state changes
    useEffect(() => {
        const keysPressed = new Set();

        const handleKeyDown = (event) => {
            keysPressed.add(event.code);

            if (keysPressed.has("KeyW") || keysPressed.has("KeyA") || keysPressed.has("KeyS") || keysPressed.has("KeyD")) {
                if (keysPressed.has("ShiftLeft") || keysPressed.has("ShiftRight")) {
                    curAnimationRef.current = "CharacterArmature|Run";
                } else {
                    curAnimationRef.current = "CharacterArmature|Walk";
                }
            }
        };

        const handleKeyUp = (event) => {
            keysPressed.delete(event.code);

            if (![..."WASD"].some((key) => keysPressed.has(`Key${key}`))) {
                curAnimationRef.current = "CharacterArmature|Idle";
            } else if (keysPressed.has("ShiftLeft") || keysPressed.has("ShiftRight")) {
                curAnimationRef.current = "CharacterArmature|Run";
            } else {
                curAnimationRef.current = "CharacterArmature|Walk";
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    // Set up character group reference once
    useEffect(() => {
        if (rigidBodyRef.current && !characterGroupRef.current) {
            try {
                characterGroupRef.current = rigidBodyRef.current.parent?.parent?.parent;
            } catch (e) {
                // Silent fail, will try again next frame
            }
        }
    });

    // Socket emission in separate interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (!characterGroupRef.current) {
                if (rigidBodyRef.current) {
                    try {
                        characterGroupRef.current = rigidBodyRef.current.parent?.parent?.parent;
                    } catch (e) {
                        return;
                    }
                } else {
                    return;
                }
            }

            const newPos = [
                characterGroupRef.current.position.x ?? 0,
                characterGroupRef.current.position.y ?? 0,
                characterGroupRef.current.position.z ?? 0,
            ];

            const newRot = [
                characterGroupRef.current.rotation.x ?? 0,
                characterGroupRef.current.rotation.y ?? 0,
                characterGroupRef.current.rotation.z ?? 0
            ];

            const newAnimation = curAnimationRef.current

            //Optimization technique
            //The user sends current properties only when it moved, rotated enough or changed animation
            const movementThreshold = 0.1;
            const rotationThreshold = 0.1;
            const positionChanged = newPos.some((val, i) => Math.abs(val - lastPositionRef.current[i]) > movementThreshold);
            const rotationChanged = newRot.some((val, i) => Math.abs(val - lastRotationRef.current[i]) > rotationThreshold);
            const animationChanged = newAnimation !== lastAnimationRef.current;

            if (positionChanged || rotationChanged || animationChanged) {
                socket.emit("move", {
                    position: newPos,
                    animation: newAnimation,
                    rotation: newRot,
                });

                lastPositionRef.current = [...newPos];
                lastRotationRef.current = [...newRot];
                lastAnimationRef.current = newAnimation;
            }
        }, EMIT_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <Suspense fallback={null}>
            <KeyboardControls map={keyboardMap}>
                <Ecctrl
                    position={position}
                    animated
                    floatingDis={0.3}
                    //Camera position relative to character
                    camTargetPos={{ x: 0, y: 0.58, z: 0.5 }}
                    //First person view settings
                    camCollision={false} 
                    camInitDis={0.5} 
                    camMinDis={0.1} 
                    camFollowMult={20} 
                    camLerpMult={1000} 
                    turnVelMultiplier={1} 
                    turnSpeed={100} 
                    mode="CameraBasedMovement"
                    maxVelLimit={2}
                    accDist={0.1}
                >
                    {
                        props.gender === "male" ?
                            <EcctrlAnimation characterURL={manCharacterURL} animationSet={animationSet}>
                                <Man position={[0, -0.65, 0]} scale={1} ref={rigidBodyRef} hairColor={props.hairColor} suitColor={props.suitColor} trousersColor={props.trousersColor} />
                            </EcctrlAnimation>
                            :
                            <EcctrlAnimation characterURL={womanCharacterURL} animationSet={animationSet}>
                                <Woman position={[0, -0.65, 0]} scale={1} ref={rigidBodyRef} hairColor={props.hairColor} suitColor={props.suitColor} trousersColor={props.trousersColor} />
                            </EcctrlAnimation>
                    }
                </Ecctrl>
            </KeyboardControls>
        </Suspense>
    )

}