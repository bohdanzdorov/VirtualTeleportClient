import { socket } from "../SocketManager"

/*
    Input field for the current TV link
*/
export const TvLinkInput = (props) => {

    const handleTvLinkInput = (event) => {
        props.setTvLink(event.target.value)
        socket.emit("tvLink", {tvLink: event.target.value})
    }
    //Helper function, so that when users type in the info into textfield, its avatar is standing still
    const handleTvLinkFocus = () => {props.setIsMovementAllowed(false)}
    const handleTvLinkBlur = () => {props.setIsMovementAllowed(true)}

    return (
        <input type="text"
            value={props.tvLink} 
            onChange={handleTvLinkInput} 
            onFocus={handleTvLinkFocus} 
            onBlur={handleTvLinkBlur} 
            className="tvLinkInput environmentUI" 
        />
    )
}