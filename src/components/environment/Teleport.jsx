import React, { useState } from "react"
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { socket } from "./SocketManager"
import { Map } from "./Map";
import { OtherCharacter } from "./OtherCharacter";
import { useEffect, useRef } from "react";
import { Splat } from "@react-three/drei";
import TV from "./TV";
import { UpdatedCharacterController } from "./UpdatedCharacterController";
import WebCamTV from "./WebCamTV";

import { StreamVideoClient, StreamVideo, StreamCall } from "@stream-io/video-react-sdk";
import { MyUILayout } from "../MyUILayout";

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
        scale: 3.75,
        position: [0, -0.8, 0]
    }
};

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL1NhdGVsZV9TaGFuIiwidXNlcl9pZCI6IlNhdGVsZV9TaGFuIiwidmFsaWRpdHlfaW5fc2Vjb25kcyI6NjA0ODAwLCJpYXQiOjE3NDQ3NTExNzYsImV4cCI6MTc0NTM1NTk3Nn0.kfPr4YptQqvJ41hDMmaoMq5QWfoROTRCJDRPHHrRDuA';
const userId = 'Satele_Shan';
const callId = 'gYjwK2fLwVgU';

// set up the user object
const user = {
    id: userId,
    name: 'Oliver',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });

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

            <Physics debug={false}>
                <Suspense>
                    {
                        props.roomMode === "Connection" ?

                            <StreamVideo client={client}>
                                <StreamCall call={call}>
                                    <MyUILayout />
                                </StreamCall>
                            </StreamVideo>

                            : props.roomMode === "TV" ?
                                <TV position={[-0.8, 0.95, 3.5]} rotation={[0, 3.15, 0]} scale={0.13} url={props.tvLink} />
                                : <></>
                    }
                </Suspense>
                <Suspense>
                    <Map
                        scale={maps[map].scale}
                        position={maps[map].position}
                        model={`models/${map}.glb`}
                    />
                    {
                        props.users.map((user) => (
                            user.id === socket.id ?
                                <UpdatedCharacterController key={user.id} name={user.name} gender={user.gender} hairColor={user.hairColor} suitColor={user.suitColor} trousersColor={user.trousersColor} />
                                :
                                <OtherCharacter
                                    key={user.id}
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
                </Suspense>
                <Suspense>
                    <Splat
                        src="https://huggingface.co/datasets/Tiky121/Splats/resolve/main/B405.splat?download=true"
                        position-y={0.75}
                        scale={3.75}
                        rotation={[0, 5.45, 0]}
                        renderOrder={-1}
                        depthWrite={false}
                        chunkSize={10000}
                    />
                </Suspense>
            </Physics>
        </>
    )
}
