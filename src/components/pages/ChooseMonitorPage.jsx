import { useState } from "react"
import { MonitorStreamPage } from "./MonitorStreamPage"

export const ChooseMonitorPage = (props) => {

    const [chosenNumber, setChosenNumber] = useState(-1)

    const handleChooseMonitor = (monitorNumber) => {
        setChosenNumber(monitorNumber)
    }


    return (
        <div>
            {
                chosenNumber !== -1 ? 
                <MonitorStreamPage chosenNumber={chosenNumber} occupiedWebCamTVs={props.occupiedWebCamTVs} /> 
                :
                <div>
                    <button className="goBackButton">Back</button>
                    <h3>Choose the monitor to display</h3>
                    <button onClick={() => handleChooseMonitor(1)}>1</button>
                    <button onClick={() => handleChooseMonitor(2)}>2</button>
                </div>
            }
        </div>
    )
}