import "../../styles/ChooseMonitorPage.css"

import { useState, useEffect } from "react"

import { MonitorStreamPage } from "./MonitorStreamPage"

import { createAgoraSpectator } from "../../hooks/useAgora";
import { socket } from "../SocketManager";

export const ChooseMonitorPage = (props) => {

    const [remoteStreams, setRemoteStreams] = useState({});
    const [chosenNumber, setChosenNumber] = useState(-1)

    const setChooseMonitorPage = () => { setChosenNumber(-1) }

    const handleChooseMonitor = (monitorNumber) => {
        setChosenNumber(monitorNumber)
    }

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

    return (
        <>
            {chosenNumber !== -1 ? (
                <MonitorStreamPage
                    key={chosenNumber}
                    remoteStreams={remoteStreams}
                    chosenNumber={chosenNumber}
                    occupiedWebCamTVs={props.occupiedWebCamTVs}
                    setChooseMonitorPage={setChooseMonitorPage}
                />
            ) : (
                <div className="choose-monitor-container">
                    <button className="goBackButton" onClick={props.setMainPage}>Back</button>
                    <h3>Choose the monitor to display</h3>
                    <div className="monitor-buttons">
                        <button className="monitor-button" onClick={() => handleChooseMonitor(1)}>Monitor 1</button>
                        <button className="monitor-button" onClick={() => handleChooseMonitor(2)}>Monitor 2</button>
                        <button className="monitor-button" onClick={() => handleChooseMonitor(3)}>Monitor 3</button>
                        <button className="monitor-button" onClick={() => handleChooseMonitor(4)}>Monitor 4</button>
                        <button className="monitor-button" onClick={() => handleChooseMonitor(5)}>Monitor 5</button>
                    </div>
                </div>
            )}
        </>
    )
}
