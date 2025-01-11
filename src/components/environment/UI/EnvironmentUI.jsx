import { MicButton } from "./MicButton"
import { RooomModeController } from "./RoomModeController"
import { TvLinkInput } from "./TvLinkInput"

export const EnvironmentUI = (props) => {    
    return (
        <>
            <MicButton micState={props.micState} setMicState={props.setMicState}/>
            <RooomModeController roomMode={props.roomMode} setRoomMode={props.setRoomMode}/>
            {
                props.roomMode === "TV" ?
                <TvLinkInput tvLink={props.tvLink} setTvLink={props.setTvLink}     
                            setIsMovementAllowed={props.setIsMovementAllowed}/>
                : <></>
            }
            
        </>
    )
}