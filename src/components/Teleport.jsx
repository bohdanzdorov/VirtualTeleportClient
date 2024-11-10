import React from "react"
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useAtom } from "jotai"
import { useControls } from "leva";
import { usersAtom, socket } from "./SocketManager"
import { CharacterController } from "./CharacterController"
import { Map } from "./Map";
import { OtherCharacter } from "./OtherCharacter";

const maps = {
    castle_on_hills: {
        scale: 3,
        position: [-6, -7, 0],
    },
    animal_crossing_map: {
        scale: 20,
        position: [-15, -3, 10],
    },
    city_scene_tokyo: {
        scale: 0.72,
        position: [0, -1, -3.5],
    },
    de_dust_2_with_real_light: {
        scale: 0.3,
        position: [-5, -3, 13],
    },
    medieval_fantasy_book: {
        scale: 0.4,
        position: [-4, 0, -6],
    },
};


export const Teleport = () => {
    const [users] = useAtom(usersAtom)

    const { map } = useControls("Map", {
        map: {
            value: "animal_crossing_map",
            options: Object.keys(maps),
        },
    });

    return (
        <>
            <Environment preset="sunset" />
            <Physics >
                <Map
                    scale={maps[map].scale}
                    position={maps[map].position}
                    model={`models/${map}.glb`}
                />
                {users.map((user) => (
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
