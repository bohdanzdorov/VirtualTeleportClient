import { socket } from "../SocketManager"

export const TvLinkInput = (props) => {

    const handleTvLinkInput = (event) => {
        props.setTvLink(event.target.value)
        socket.emit("tvLink", {tvLink: event.target.value})
    }
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