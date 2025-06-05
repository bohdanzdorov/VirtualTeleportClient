import { useState, useEffect, Suspense } from "react"
import { Environment, Splat } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { createAgoraClient } from "../../hooks/useAgora";
import { socket } from "../SocketManager"

import { Map } from "../Environment/Map";
import { OtherCharacter } from "../Environment/OtherCharacter";
import { CharacterController } from "../CharacterControllers/CharacterController";
import TV from "../Environment/VirtualTVs/TV";
import WebCamTV from "../Environment/VirtualTVs/WebCamTV";

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
/*
    Main component for the virtual environment
*/
export const Teleport = (props) => {

    const [videoStream, setVideoStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});

    useEffect(() => {
        let client;
        //join as an active participant
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

    //Used to display correct video stream on the correct TV
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
                                    scale={1}
                                    stream={getVideoStreamByTV(1)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 1)}
                                    onSelect={() => selectWebCamTV(1)}
                                />
                                <WebCamTV
                                    position={[1.18, 0.95, 3.7]}
                                    rotation={[0, 3.15, 0]}
                                    scale={1}
                                    stream={getVideoStreamByTV(2)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 2)}
                                    onSelect={() => selectWebCamTV(2)}
                                />
                                <WebCamTV
                                    position={[-2.55, 0.79, 1]}
                                    rotation={[0, Math.PI / 2, 0]}
                                    scale={0.65}
                                    stream={getVideoStreamByTV(3)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 3)}
                                    onSelect={() => selectWebCamTV(3)}
                                />
                                <WebCamTV
                                    position={[-2.55, 0.79, -0.25]}
                                    rotation={[0, Math.PI / 2, 0]}
                                    scale={0.65}
                                    stream={getVideoStreamByTV(4)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 4)}
                                    onSelect={() => selectWebCamTV(4)}
                                />
                                <WebCamTV
                                    position={[-2.55, 0.79, -1.5]}
                                    rotation={[0, Math.PI / 2, 0]}
                                    scale={0.65}
                                    stream={getVideoStreamByTV(5)}
                                    isActive={props.occupiedWebCamTVs.some(el => el.tvNumber === 5)}
                                    onSelect={() => selectWebCamTV(5)}
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
                                <CharacterController key={user.id} isFirstPersonView={props.isFirstPersonView} setIsFirstPersonView={props.setIsFirstPersonView} name={user.name} gender={user.gender} hairColor={user.hairColor} suitColor={user.suitColor} trousersColor={user.trousersColor} />
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
                    {/* Room Model */}
                    <Splat
                        src="https://huggingface.co/datasets/BohdanZdorov/JARO/resolve/main/JARO.splat?download=true"
                        position={[2, 0.3, 0]}
                        scale={0.2}
                        rotation={[0, 4.2, 0]}
                        renderOrder={-1}
                        depthWrite={true}
                        chunkSize={10000}
                    />
                    {/* JARO Model */}
                    <Splat
                        src="https://huggingface.co/datasets/Tiky121/Splats/resolve/main/B405.splat?download=true"
                        position-y={0.75}
                        scale={3.75}
                        rotation={[0, 5.45, 0]}
                        renderOrder={-2}
                        depthWrite={true}
                        chunkSize={10000}
                    />
                </Suspense>
            </Physics>
        </>
    )
}
