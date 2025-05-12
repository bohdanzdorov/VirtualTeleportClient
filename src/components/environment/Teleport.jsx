import React, { useState } from "react"
import { Environment, Html, Text } from "@react-three/drei";
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
import { createAgoraClient } from "../../hooks/useAgora";
import {VideoTV} from './VideoTV'
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

    const [videoStream, setVideoStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    useEffect(() => {
        let client;

        createAgoraClient({
            userId: socket.id,
            onUserPublished: (user, videoTrack) => {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(videoTrack.getMediaStreamTrack());
                setRemoteStreams(prev => ({ ...prev, [user.uid]: mediaStream }));
            },
            onUserLeft: (user) => {
                setRemoteStreams(prev => {
                    const updated = { ...prev };
                    delete updated[user.uid];
                    return updated;
                });
            }
        }).then(async (res) => {
            client = res.client;
            const mediaStream = new MediaStream();
            mediaStream.addTrack(res.localVideoTrack.getMediaStreamTrack());
            setVideoStream(mediaStream);
            props.setLocalAudioTrack(res.localAudioTrack);
        });

        return () => {
            if (client) client.leave();
        };
    }, []);


    const getVideoStreamByTV = (tvNumber) => {
        const tvEntry = props.occupiedWebCamTVs.find(el => el.tvNumber === tvNumber);
        if (!tvEntry) return videoStream;
        return remoteStreams[tvEntry.userId] || videoStream;
    }

    const selectWebCamTV = (tvNumber) => {
        props.setIsFirstPersonView(true)
        socket.emit("occupyWebCamTV", {
            userId: socket.id,
            tvNumber: tvNumber,
        })
    }

    // const { map } = useControls("Map", {
    //     map: {
    //         value: "b406",
    //         options: Object.keys(maps),
    //     }
    // });

    return (
        <>
            <Environment preset="dawn" />
            <Physics debug={false}>
                <Suspense>
                    {
                        props.roomMode === "Connection" ?
                            <>
                                <WebCamTV
                                    position={[-0.87, 0.95, 3.7]}
                                    rotation={[0, 3.15, 0]}
                                    scale={1.6}
                                    stream={getVideoStreamByTV(1)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 1)}
                                    onSelect={() => selectWebCamTV(1)}
                                />
                                <WebCamTV
                                    position={[1.18, 0.95, 3.7]}
                                    rotation={[0, 3.15, 0]}
                                    scale={1.6}
                                    stream={getVideoStreamByTV(2)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 2)}
                                    onSelect={() => selectWebCamTV(2)}
                                />
                            </>
                            : props.roomMode === "TV" ?
                                <TV position={[-0.8, 0.95, 3.5]} rotation={[0, 3.15, 0]} scale={0.13} url={props.tvLink} />
                                : <></>
                    }
                </Suspense>
                <Suspense>
                    <Map
                        scale={3.75}
                        position={[0, -0.8, 0]}
                        model={`models/b406.glb`}
                    />
                    {
                        props.users.map((user) => (
                            user.id === socket.id ?
                                <UpdatedCharacterController key={user.id} isFirstPersonView={props.isFirstPersonView} setIsFirstPersonView={props.setIsFirstPersonView} name={user.name} gender={user.gender} hairColor={user.hairColor} suitColor={user.suitColor} trousersColor={user.trousersColor} />
                                :
                                user.isVisible && <OtherCharacter
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
