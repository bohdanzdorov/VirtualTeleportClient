import { useEffect, useState } from "react";
import micOff from '../../../assets/icons/mic-off.png';
import micOn from '../../../assets/icons/mic-on.png';

export function MicButton(props) {

    const handleMicButtonClick = () => {
        props.setMicState(prevState => !prevState);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === "e") {
                props.setMicState(prevState => !prevState);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [props.setMicState]);

    return (
        <div onClick={handleMicButtonClick} style={{ aspectRatio: 1 / 1 }} id="mic-button">
            <img src={props.micState ? micOn : micOff} alt="Mic Status" />
        </div>
    );
}
