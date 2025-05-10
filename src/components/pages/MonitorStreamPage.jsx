import { createAgoraSpectator } from "../../hooks/useAgora";
import { socket } from "../environment/SocketManager";

import { useEffect, useRef, useState } from "react";
import "../../styles/MonitorStreamPage.css"

export const MonitorStreamPage = (props) => {
    const [remoteStreams, setRemoteStreams] = useState({});
    const videoRef = useRef();

    useEffect(() => {
        let client;
        createAgoraSpectator({
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
        });

        return () => {
            if (client) client.leave();
        };
    }, []);

    const getVideoStreamByTV = (tvNumber) => {
        const tvEntry = props.occupiedWebCamTVs.find(el => el.tvNumber === tvNumber);
        if (!tvEntry) return null;
        return remoteStreams[tvEntry.userId] || null;
    }

    useEffect(() => {
        console.log("CHECK")
        const stream = getVideoStreamByTV(props.chosenNumber);
        if (videoRef.current && stream instanceof MediaStream) {
            videoRef.current.srcObject = stream;
        } else {
            videoRef.current.srcObject = null
        }
    }, [remoteStreams, props.chosenNumber, props.occupiedWebCamTVs]);

    return (
        <div className="monitor-stream-container">
            <button className="goBackButton" onClick={props.setMainPage}>Back</button>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                controls
                poster="/MonitorWaitingPoster.png"
            />
        </div>
    );
};
