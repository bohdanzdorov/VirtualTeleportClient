import { useEffect } from "react";
import camOn from '../../assets/icons/cam-on.png';
import camOff from '../../assets/icons/cam-off.png';

/*
    Button to toggle video sending to other users
*/
export function CamButton(props) {

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === "c") {
                props.toggleCam();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div onClick={props.toggleCam} id="cam-button" className="environmentUI">
            <img src={props.camEnabled ? camOn : camOff} alt="Camera Status" />
        </div>
    );
}
