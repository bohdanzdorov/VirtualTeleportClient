import React, { useState } from "react"
import { Environment, Html, Plane } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useAtom } from "jotai"
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
};

export const Teleport = (props) => {

    const usersRef = useRef(props.users);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        usersRef.current = props.users;
    }, [props.users]);

    setTimeout(()=> {
        setCounter(1)
    }, 1000);

    const { map } = useControls("Map", {
        map: {
            value: "test",
            options: Object.keys(maps),
        },
    });

    return (
        <>
            <Environment preset="dawn"/>
            <Physics >
                <TV/>
                <Map
                    scale={maps[map].scale}
                    position={maps[map].position}
                    model={`models/${map}.glb`}
                />
                {
                    counter === 1 ?
                    <Splat
                    src={import.meta.env.VITE_GAUSSIAN_MAP_URL}
                    position-y={-0.3}
                    scale={1}
                    /> : <></>
                }
                {props.users.map((user) => (
                    user.id === socket.id ?
                        <CharacterController
                            key={user.id}
                            isLocal={true}
                            users={user}
                        /> :
                        <OtherCharacter key={user.id} 
                        position={user.position} 
                        animation={user.animation}
                        rotation={user.rotation}
                        linvel={user.linvel}
                        containerRotation={user.containerRotation}/>
                ))}
            </Physics>
        </>
    )
}
