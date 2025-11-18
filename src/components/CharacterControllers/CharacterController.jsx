import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useFrame } from "@react-three/fiber";

import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";

import { useCharacterKeyboard } from "../../hooks/useCharacterKeyboard";
import { useCharacterSync } from "../../hooks/useCharacterSync";

import { Man } from "../Environment/Models/Man";
import { Woman } from "../Environment/Models/Woman";

export const CharacterController = (props) => {
    // Allow optional camera vertical limits (radians). Defaults chosen to reasonable FPV limits.
    const camUpLimit = props.camUpLimit ?? 0.3; // max pitch up (radians)
    const camLowLimit = props.camLowLimit ?? -0.1; // max pitch down (radians)

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

    const curAnimationRef = useCharacterKeyboard();
    
    // Use the character sync hook for socket emissions
    const EMIT_INTERVAL = 100; // 100ms = 10 updates/second
    const THRESHOLDS = { movement: 0.1, rotation: 0.1 };
    useCharacterSync(rigidBodyRef, curAnimationRef, EMIT_INTERVAL, THRESHOLDS);

    return (
        <Suspense fallback={null}>
            <KeyboardControls map={keyboardMap}>
                <Ecctrl
                    position={position}
                    animated
                    floatingDis={0.3}
                    //Camera position relative to character
                    camTargetPos={{ x: 0, y: 0.52, z: 0.5 }}
                    //First person view settings
                    camCollision={false} 
                    camInitDis={0.5} 
                    camMinDis={0.1} 
                    camFollowMult={20} 
                    camLerpMult={1000} 
                    turnVelMultiplier={1} 
                    turnSpeed={100} 
                    // Vertical camera rotation limits (radians)
                    camUpLimit={0.6}
                    camLowLimit={-0.2}
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