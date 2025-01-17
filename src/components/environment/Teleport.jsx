import React, { useState } from "react"
import { Environment, Html, Plane, Text } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { socket } from "./SocketManager"
import { CharacterController } from "./CharacterController"
import { Map } from "./Map";
import { OtherCharacter } from "./OtherCharacter";
import { useEffect, useRef } from "react";
import { Splat } from "@react-three/drei";
import TV from "./TV";

const maps = {
    test: {
        scale: 1,
        position: [0, -0.9, 0],
    },
    office: {
        scale: 1,
        position: [-0.65, -1.25, -1],
    },
    b406: {
        scale: 1,
        position: [0, -0.8, 0]
    }
};

export const Teleport = (props) => {

    const usersRef = useRef(props.users);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        usersRef.current = props.users;
    }, [props.users]);

    setTimeout(() => {
        setCounter(1)
    }, 1000);

    const { map } = useControls("Map", {
        map: {
            value: "b406",
            options: Object.keys(maps),
        }
    });

    return (
        <>
            <Environment preset="dawn" />
            <Physics >
                {
                    props.roomMode === "TV" ?
                    <TV position={[0.0, -0.24, 0.93]} rotation={[0, 3.15, 0]} scale={0.07} url={props.tvLink} />
                    : <></>
                }
                <Map
                    scale={maps[map].scale}
                    position={maps[map].position}
                    model={`models/${map}.glb`}
                />
                {
                    counter === 1 ?
                        <Splat
                            src="https://huggingface.co/datasets/Tiky121/Splats/resolve/main/B405.splat?download=true"
                            position-y={-0.3}
                            scale={1}
                            rotation={[0, 5.45, 0]}
                        /> : <></>
                }

                {
                    props.users.map((user) => (
                        user.id === socket.id ?
                            <CharacterController key={user.id} isMovementAllowed={props.isMovementAllowed} name={user.name} gender={user.gender} hairColor={user.hairColor} suitColor={user.suitColor} trousersColor={user.trousersColor} />
                            :
                            <OtherCharacter key={user.id}
                                name={user.name}
                                gender={user.gender}
                                hairColor={user.hairColor}
                                suitColor={user.suitColor}
                                trousersColor={user.trousersColor}
                                position={user.position}
                                animation={user.animation}
                                rotation={user.rotation}
                                linvel={user.linvel}
                                containerRotation={user.containerRotation}
                            />
                    ))
                }

            </Physics>
        </>
    )
}
