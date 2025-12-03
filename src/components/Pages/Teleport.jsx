import { useState, useEffect, Suspense } from "react"
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
    const [isTVVisible, setIsTVVisible] = useState(true);

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

    return (
        <>
            <Environment preset="dawn" />
            <Physics debug={false} allowSleep={true}>          
                <Suspense>
                    {isTVVisible && (
                        <TV position={[3.3, 1.2, 2]} rotation={[0, 4.75, 0]} scale={0.22} url={props.tvLink} />
                    )}
                    <TVSwitcher
                        position={[2.2, 0.5, 1.8]}
                        rotation={[0, 4.75, 0]}
                        scale={0.5}
                        isOn={isTVVisible}
                        onToggle={() => setIsTVVisible((prev) => !prev)}
                    />
                    <OtherCharacter
                        name={"Test User"}
                        position={[-2.55, 0.3, -1.5]}
                        rotation={[0, Math.PI / 2, 0]} 
                        stream={videoStream}    
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
