import { MicButton } from "./MicButton"
import { TvLinkInput } from "./TvLinkInput"

export const EnvironmentUI = (props) => {    
    return (
        <>
            <MicButton micState={props.micState} setMicState={props.setMicState} switchMicState={props.switchMicState}/>
            <TvLinkInput tvLink={props.tvLink} setTvLink={props.setTvLink} setIsMovementAllowed={props.setIsMovementAllowed}/>
        </>
    )
}