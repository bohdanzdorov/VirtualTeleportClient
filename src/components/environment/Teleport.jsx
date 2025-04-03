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

    const [webcamStream, setWebcamStream] = useState(null);
    const [activeTV, setActiveTV] = useState(null); // State to track selected TV

    useEffect(() => {
        async function getWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setWebcamStream(stream);
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        }
        getWebcam();
    }, []);

    return (
        <>
            <Environment preset="dawn" />
            <Physics debug={false}>
                <Suspense>
                    <Map
                        scale={maps[map].scale}
                        position={maps[map].position}
                        model={`models/${map}.glb`}
                    />
                    {
                        props.roomMode === "Connection" ?
                            <>
                                <WebCamTV
                                    position={[-0.87, 0.95, 3.7]}
                                    rotation={[0, 3.15, 0]}
                                    scale={1.6}
                                    stream={webcamStream}
                                    isActive={activeTV === "left"}
                                    onSelect={() => setActiveTV("left")}
                                />
                                <WebCamTV
                                    position={[1.18, 0.95, 3.7]}
                                    rotation={[0, 3.15, 0]}
                                    scale={1.6}
                                    stream={webcamStream}
                                    isActive={activeTV === "right"}
                                    onSelect={() => setActiveTV("right")}
                                />
                            </>
                            : props.roomMode === "TV" ?
                                <TV position={[-0.8, 0.95, 3.5]} rotation={[0, 3.15, 0]} scale={0.13} url={props.tvLink} />
                                : <></>
                    }
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
