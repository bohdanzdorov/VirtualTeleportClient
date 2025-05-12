import { useEffect } from "react";
import micOff from '../../assets/icons/mic-off.png';
import micOn from '../../assets/icons/mic-on.png';

export function MicButton(props) {

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === "e") 
                props.toggleMic()
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div onClick={props.toggleMic}  id="mic-button" className="environmentUI">
            <img src={props.micEnabled ? micOn : micOff} alt="Mic Status" />
        </div>
    );
}
