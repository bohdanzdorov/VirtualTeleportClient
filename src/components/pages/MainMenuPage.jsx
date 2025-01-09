import { Canvas } from "@react-three/fiber"
import { Character } from "../environment/Character"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Environment, Html, Plane } from "@react-three/drei";
import {socket} from "../environment/SocketManager"

export const MainMenuPage = (props) => {

    const canvasContainerRef = useRef();
    const [hairColor, setHairColor] = useState("#553211")
    const [suitColor, setSuitColor] = useState("#000000")
    const [trousersColor, setTrousersColor] = useState("#000000")

    const handleTrousersColorChange = (event) => setTrousersColor(event.target.value);
    const handleHairColorChange = (event) => setHairColor(event.target.value);
    const handleSuitColorChange = (event) => setSuitColor(event.target.value);


    const updateCanvasSize = () => {
        if (canvasContainerRef.current) {
            const width = canvasContainerRef.current.offsetWidth;
            const height = canvasContainerRef.current.offsetHeight;
        }
    };

    useEffect(() => {
        window.addEventListener("resize", updateCanvasSize);
        updateCanvasSize(); 

        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    
    const onRoomConnect = () => {
        socket.emit("roomConnect", {
            name: "name",
            hairColor: hairColor,
            suitColor: suitColor,
            trousersColor: trousersColor
        })
        props.setIsConnectedToRoom(true)
    }
    
    return (
        <div className="mainDiv">
            <h2>Virtual Teleport</h2>
            <input type="text" placeholder="Name"/>
            <div className="characterEditorDiv">
                <div className="inputBoxesDiv">
                    <div className="editorBox">
                        <h3>Gender</h3>
                        <input type="radio" id="genderChoice1" name="gender" value="male" />
                        <label for="genderChoice1">Male</label>
                        <input type="radio" id="genderChoice2" name="gender" value="female" />
                        <label for="genderChoice2">Female</label>
                    </div>
                    <div className="editorBox">
                        <label htmlFor="hairColorInput">Hair color</label>
                        <input id="hairColorInput" type="color" value={hairColor} onChange={handleHairColorChange}/>
                    </div>
                    <div className="editorBox">
                        <label htmlFor="suitColorInput">Suit color</label>
                        <input id="suitColorInput" type="color" value={suitColor} onChange={handleSuitColorChange}/>
                    </div>
                    <div className="editorBox">
                        <label htmlFor="suitColorInput">Trousers color</label>
                        <input id="suitColorInput" type="color" value={trousersColor} onChange={handleTrousersColorChange}/>
                    </div>
                </div>
                <div className="displayModelDiv" ref={canvasContainerRef}>
                    
                    <Canvas
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Environment preset="dawn" />
                        
                        {/* Make sure to use OrbitControls to interact with the model */}
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                        <OrbitControls />
                        <Character
                            scale={1.75}
                            position={[0, -1.5, 0]}
                            animation={"idle"}
                            hairColor={hairColor}
                            suitColor={suitColor}
                            trousersColor={trousersColor}
                        />
                    </Canvas>
                </div>
            </div>
            <input type="button" onClick={onRoomConnect} value={"Connect"}/>
        </div>
    )
}