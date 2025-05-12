import "../../styles/MonitorStreamPage.css"

import { useEffect, useRef } from "react";

export const MonitorStreamPage = (props) => {
    const videoRef = useRef();

    const getVideoStreamByTV = (tvNumber) => {
        const tvEntry = props.occupiedWebCamTVs.find(el => el.tvNumber === tvNumber);
        if (!tvEntry) return null;
        return props.remoteStreams[tvEntry.userId] || null;
    }

    useEffect(() => {
        const stream = getVideoStreamByTV(props.chosenNumber);
        if (videoRef.current && stream instanceof MediaStream) {
            videoRef.current.srcObject = stream;
        } else {
            videoRef.current.srcObject = null
        }
    }, [props.remoteStreams, props.chosenNumber, props.occupiedWebCamTVs]);

    return (
        <div className="monitor-stream-container">
            <button className="goBackButton" onClick={props.setChooseMonitorPage}>Back</button>
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
