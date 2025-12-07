import { useState, useEffect, Suspense, useRef } from "react"
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

import { createAgoraClient } from "../../hooks/useAgora";
import { socket } from "../SocketManager"

import { Map } from "../Environment/Map";
import { OtherCharacter } from "../Environment/OtherCharacter";
import { CharacterController } from "../CharacterControllers/CharacterController";
import TV from "../Environment/VirtualTVs/TV";
import TVSwitcher from "../Environment/VirtualTVs/TVSwitcher";

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
    const clientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    const localVideoTrackRef = useRef(null);

    useEffect(() => {
        let client;
        let cancelled = false;

        setVideoStream(null);
        setRemoteStreams({});

        createAgoraClient({
            userId: socket.id,
            channelName: props.roomId,
            onUserPublished: (user, videoTrack) => {
                if (cancelled) return;
                const mediaStream = new MediaStream();
                mediaStream.addTrack(videoTrack.getMediaStreamTrack());
                setRemoteStreams(prev => ({ ...prev, [user.uid]: mediaStream }));
            },
            onUserLeft: (user) => {
                if (cancelled) return;
                setRemoteStreams(prev => {
                    const updated = { ...prev };
                    delete updated[user.uid];
                    return updated;
                });
            },
            onUserUnpublished: (user) => {
                if (cancelled) return;
                setRemoteStreams(prev => {
                    const updated = { ...prev };
                    delete updated[user.uid];
                    return updated;
                });
            }
        }).then(async (res) => {
            if (cancelled) {
                await res.client.leave().catch(() => {});
                res.localAudioTrack?.stop();
                res.localAudioTrack?.close();
                res.localVideoTrack?.stop();
                res.localVideoTrack?.close();
                return;
            }

            client = res.client;
            clientRef.current = client;
            props.setAgoraClient?.(client);

            localAudioTrackRef.current = res.localAudioTrack ?? null;
            localVideoTrackRef.current = res.localVideoTrack ?? null;

            props.setLocalAudioTrack?.(res.localAudioTrack ?? null);
            props.setLocalVideoTrack?.(res.localVideoTrack ?? null);

            if (props.camEnabled !== false && res.localVideoTrack) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(res.localVideoTrack.getMediaStreamTrack());
                setVideoStream(mediaStream);
            }
        });

        return () => {
            cancelled = true;

            const activeClient = clientRef.current || client;
            if (activeClient) {
                activeClient.leave().catch(() => {});
            }
            clientRef.current = null;

            if (localAudioTrackRef.current) {
                localAudioTrackRef.current.stop();
                localAudioTrackRef.current.close();
                localAudioTrackRef.current = null;
            }

            if (localVideoTrackRef.current) {
                localVideoTrackRef.current.stop();
                localVideoTrackRef.current.close();
                localVideoTrackRef.current = null;
            }

            props.setLocalAudioTrack?.(null);
            props.setLocalVideoTrack?.(null);
            props.setAgoraClient?.(null);
            setVideoStream(null);
            setRemoteStreams({});
            socket.emit("leaveRoom");
        };
    }, [props.roomId, props.setLocalAudioTrack, props.setLocalVideoTrack, props.setAgoraClient]);

    // Reflect camera enabled/disabled in local monitor stream
    useEffect(() => {
        if (!props.camEnabled || !props.localVideoTrack) {
            setVideoStream(null);
            return;
        }

        const mediaStream = new MediaStream();
        mediaStream.addTrack(props.localVideoTrack.getMediaStreamTrack());
        setVideoStream(mediaStream);
    }, [props.camEnabled, props.localVideoTrack]);

    return (
        <>
            <Environment preset="dawn" />
            <Physics debug={false} allowSleep={true}>          
                <Suspense>
                    {props.isTVVisible && (
                        <TV position={[3.3, 1.2, 2]} rotation={[0, 4.75, 0]} scale={0.2} url={props.tvLink} />
                    )}
                    <TVSwitcher
                        position={[2.2, 0.01, 1.8]}
                        rotation={[0, 4.75, 0]}
                        scale={0.5}
                        isOn={props.isTVVisible}
                        onToggle={() => {
                            const newState = !props.isTVVisible;
                            props.setIsTVVisible(newState);
                            socket.emit("tvVisibility", { isTVVisible: newState });
                        }}
                    />
                    <Map
                        scale={2.75}
                        position={[0, -0.8, 0]}
                        model={`models/office.glb`}
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
                                    stream={remoteStreams[user.id]}
                                />
                        ))
                    }
                </Suspense>
            </Physics>
        </>
    )
}
