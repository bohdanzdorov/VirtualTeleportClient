import { useState } from "react"
import { MonitorStreamPage } from "./MonitorStreamPage"
import "../../styles/ChooseMonitorPage.css"

export const ChooseMonitorPage = (props) => {

    const [chosenNumber, setChosenNumber] = useState(-1)

    const handleChooseMonitor = (monitorNumber) => {
        setChosenNumber(monitorNumber)
    }

    return (
        <>
            {chosenNumber !== -1 ? (
                <MonitorStreamPage
                    chosenNumber={chosenNumber}
                    occupiedWebCamTVs={props.occupiedWebCamTVs}
                    setMainPage={props.setMainPage}
                />
            ) : (
                <div className="choose-monitor-container">
                    <button className="goBackButton" onClick={props.setMainPage}>Back</button>
                    <h3>Choose the monitor to display</h3>
                    <div className="monitor-buttons">
                        <button className="monitor-button" onClick={() => handleChooseMonitor(1)}>Monitor 1</button>
                        <button className="monitor-button" onClick={() => handleChooseMonitor(2)}>Monitor 2</button>
                    </div>
                </div>
            )}
        </>
    )
}
