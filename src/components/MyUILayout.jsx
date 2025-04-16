import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import WebCamTV from "./environment/WebCamTV";

export const MyUILayout = () => {
    const { useCameraState, useParticipants } = useCallStateHooks();
    const { mediaStream } = useCameraState();
    const participants = useParticipants();

    console.log(participants)

    const [videoStream, setVideoStream] = useState(null);
    const [activeTV, setActiveTV] = useState(1);

    useEffect(() => {
        if (participants[0].videoStream) {
            // const tracks = mediaStream.getVideoTracks();
            // if (tracks.length > 0) {
                const newStream = new MediaStream(participants[0].videoStream);
                setVideoStream(newStream);
            // }
        }
    }, [mediaStream]);

    return (
        <>
            <WebCamTV
                position={[-0.87, 0.95, 3.7]}
                rotation={[0, 3.15, 0]}
                scale={1.6}
                stream={videoStream}
                isActive={activeTV === 1}
                onSelect={() => setActiveTV(1)}
            />
            <WebCamTV
                position={[1.18, 0.95, 3.7]}
                rotation={[0, 3.15, 0]}
                scale={1.6}
                stream={videoStream}
                isActive={activeTV === 2}
                onSelect={() => setActiveTV(2)}
            />
        </>
    );
};
