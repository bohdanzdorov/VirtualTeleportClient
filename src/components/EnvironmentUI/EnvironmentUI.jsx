import { MicButton } from "./MicButton"
import { CamButton } from "./CamButton"
import { RoomIdText } from "./RoomIdText"
import { TvLinkInput } from "./TvLinkInput"

/*
    Component serves as a container for all UI indside virtual environment
*/
export const EnvironmentUI = (props) => {
    return (
        <>
            <div className="environmentUI communicationControllsContainer">
                <CamButton toggleCam={props.toggleCam} camEnabled={props.camEnabled} />
                <MicButton toggleMic={props.toggleMic} micEnabled={props.micEnabled} />
            </div>
            {props.roomId && (
                <RoomIdText 
                    roomId={props.roomId} 
                />
            )}
            {props.isTVVisible && (
                <TvLinkInput
                    tvLink={props.tvLink}
                    setTvLink={props.setTvLink}
                    setIsMovementAllowed={props.setIsMovementAllowed}
                />
            )}

        </>
    )
}