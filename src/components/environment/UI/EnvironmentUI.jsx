import { LeaveWebCamTVButton } from "./LeaveWebCamTVButton"
import { MicButton } from "./MicButton"
import { RooomModeController } from "./RoomModeController"
import { TvLinkInput } from "./TvLinkInput"

export const EnvironmentUI = (props) => {    
    return (
        <>
            <MicButton toggleMic={props.toggleMic} micEnabled={props.micEnabled}/>
            <RooomModeController roomMode={props.roomMode} setRoomMode={props.setRoomMode}/>
            {
                props.isFirstPersonView && <LeaveWebCamTVButton leaveMonitor={props.leaveMonitor}/>
            }
            {
                props.roomMode === "TV" ?
                <TvLinkInput tvLink={props.tvLink} setTvLink={props.setTvLink}     
                            setIsMovementAllowed={props.setIsMovementAllowed}/>
                : <></>
            }
        </>
    )
}