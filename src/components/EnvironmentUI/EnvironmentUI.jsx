import { MicButton } from "./MicButton"
import { TvLinkInput } from "./TvLinkInput"

/*
    Component serves as a container for all UI indside virtual environment
*/
export const EnvironmentUI = (props) => {
    return (
        <>
            <MicButton toggleMic={props.toggleMic} micEnabled={props.micEnabled} />
            <TvLinkInput tvLink={props.tvLink} setTvLink={props.setTvLink} setIsMovementAllowed={props.setIsMovementAllowed} />

        </>
    )
}