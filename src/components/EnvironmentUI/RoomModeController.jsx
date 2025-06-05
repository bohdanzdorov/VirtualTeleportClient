/*
    Combo box to change room mode
*/
export const RooomModeController = (props) => {

    const handleRoomModeChange = (event) => {
        props.setRoomMode(event.target.value)
    }

    return (
        <div className="roomModeController  environmentUI">
            Room Mode: 
            <select value={props.roomMode} onChange={handleRoomModeChange}>
                <option className="non" value="Empty">Empty</option>
                <option className="non" value="TV">TV</option>
                <option className="editable" value="Connection">Connection</option>
            </select>
        </div>

    )
}