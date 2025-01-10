import { useEffect, useState } from "react";
import micOff from '../../../assets/icons/mic-off.png';
import micOn from '../../../assets/icons/mic-on.png';

export function MicButton(props) {

    const handleMicButtonClick = () => {props.setMicState(prevState => !prevState);};

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === "e") 
                handleMicButtonClick()
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div onClick={handleMicButtonClick}  id="mic-button" className="environmentUI">
            <img src={props.micState ? micOn : micOff} alt="Mic Status" />
        </div>
    );
}
