export const TvLinkInput = (props) => {
    
    const handleTvLinkInput = (event) => {
       props.setTvLink(event.target.value)
    }

    return (
        <input type="text" value={props.tvLink} onChange={handleTvLinkInput} onFocus={()=>{props.setIsMovementAllowed(false)}} onBlur={()=>{props.setIsMovementAllowed(true); props.setTvLink(event.target.value)}} className="tvLinkInput"/>
    )
}