import { useState, useRef, useEffect, Suspense } from "react";
import { useFrame } from "@react-three/fiber";

import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";

import { socket } from "../SocketManager";
import { useCharacterAnimation } from "../../hooks/useCharacterAnimation";

import { FPS } from "./FPS";
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
    const ecctrlRef = useRef();

    const animationRef = useRef();
    const curAnimation = useCharacterAnimation();

    const [lastPosition, setLastPosition] = useState([0, 0, 0]);
    const [lastRotation, setLastRotation] = useState(0);


    useFrame(() => {
        if (!rigidBodyRef.current || !ecctrlRef.current) return;

        const newPos = [
            rigidBodyRef.current.parent.parent.parent.position.x,
            rigidBodyRef.current.parent.parent.parent.position.y,
            rigidBodyRef.current.parent.parent.parent.position.z,
        ];

        const newRot = [
            rigidBodyRef.current.parent.parent.rotation.x,
            rigidBodyRef.current.parent.parent.rotation.y,
            rigidBodyRef.current.parent.parent.rotation.z
        ]

        const newAnimation = curAnimation
        
        //Optimization technique
        //The user sends current properties only when it moved enough
        const movementThreshold = 0.01;
        const rotationThreshold = 0.1
        const positionChanged = newPos.some((val, i) => Math.abs(val - lastPosition[i]) > movementThreshold);
        const rotationChanged = newRot.some((val, i) => Math.abs(val - lastRotation[i]) > rotationThreshold);

        if (positionChanged || rotationChanged) {
            socket.emit("move", {
                position: newPos,
                animation: newAnimation,
                rotation: newRot,
            });

            setLastPosition(newPos);
            setLastRotation(newRot);
        }
    });

    useEffect(() => {
        const handleChangePersonView = (e) => {
            if (e.key.toLowerCase() === "1")
                props.setIsFirstPersonView(true)
            else if (e.key.toLowerCase() === "3") {
                props.setIsFirstPersonView(false)
            }
        };

        window.addEventListener("keydown", handleChangePersonView);
        return () => window.removeEventListener("keydown", handleChangePersonView);
    }, []);

    return (
        <Suspense fallback={null}>
            <KeyboardControls map={keyboardMap}>
                {
                    props.isFirstPersonView ?
                        <FPS/>
                        :
                        <Ecctrl
                            ref={ecctrlRef}
                            key={"THRDPS"}
                            position={position}
                            camCollision={false}
                            rayLength={1.5}
                            floatingDis={0.3}
                            springK={1.5}
                            dampingC={0.1}
                            autoBalance={false}
                            autoBalanceSpringK={0}
                            autoBalanceDampingC={0}
                            slopeMaxAngle={1.2}
                            slopeUpExtraForce={0}
                            slopeDownExtraForce={0}
                            fallingGravityScale={1}
                            maxVelLimit={1}
                            scale={1}
                            animated
                            camInitDis={-2.5}
                        >
                            {
                                props.gender === "male" ?
                                    <EcctrlAnimation ref={animationRef} characterURL={manCharacterURL} animationSet={animationSet}>
                                        <Man position={[0, -0.7, 0]} scale={1} ref={rigidBodyRef} hairColor={props.hairColor} suitColor={props.suitColor} trousersColor={props.trousersColor} />
                                    </EcctrlAnimation>
                                    :
                                    <EcctrlAnimation ref={animationRef} characterURL={womanCharacterURL} animationSet={animationSet}>
                                        <Woman position={[0, -0.7, 0]} scale={1} ref={rigidBodyRef} hairColor={props.hairColor} suitColor={props.suitColor} trousersColor={props.trousersColor} />
                                    </EcctrlAnimation>
                            }
                        </Ecctrl>
                }
            </KeyboardControls>
        </Suspense>
    )

}