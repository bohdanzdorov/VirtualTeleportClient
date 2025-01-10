import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Environment } from "@react-three/drei";
import { socket } from "../environment/SocketManager"
import { Man } from "../environment/Man";
import { Woman } from "../environment/Woman";

export const MainMenuPage = (props) => {

    const canvasContainerRef = useRef();
    const [name, setName] = useState("")
    const [gender, setGender] = useState("male")
    const [hairColor, setHairColor] = useState("#553211")
    const [suitColor, setSuitColor] = useState("#000000")
    const [trousersColor, setTrousersColor] = useState("#000000")

    const handleNameChange = (event) => setName(event.target.value)
    const handleGenderChange = (event) => setGender(event.target.value);
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
            name: name,
            gender: gender,
            hairColor: hairColor,
            suitColor: suitColor,
            trousersColor: trousersColor
        })
        props.setIsConnectedToRoom(true)
    }

    return (
        <div className="mainDiv">
            <h2>Virtual Teleport</h2>
            <input type="text" placeholder="Name" value={name} onChange={handleNameChange}/>
            <div className="characterEditorDiv">
                <div className="inputBoxesDiv">
                    <div className="editorBox">
                        <h3>Gender</h3>
                        <input type="radio" id="genderChoice1" name="gender" value="male" onChange={handleGenderChange} checked={gender === "male"}/>
                        <label htmlFor="genderChoice1">Male</label>
                        <input type="radio" id="genderChoice2" name="gender" value="female" onChange={handleGenderChange} checked={gender === "female"}/>
                        <label htmlFor="genderChoice2">Female</label>
                    </div>
                    <div className="editorBox">
                        <label htmlFor="hairColorInput">Hair color</label>
                        <input id="hairColorInput" type="color" value={hairColor} onChange={handleHairColorChange} />
                    </div>
                    <div className="editorBox">
                        <label htmlFor="suitColorInput">Suit color</label>
                        <input id="suitColorInput" type="color" value={suitColor} onChange={handleSuitColorChange} />
                    </div>
                    <div className="editorBox">
                        <label htmlFor="suitColorInput">Trousers color</label>
                        <input id="suitColorInput" type="color" value={trousersColor} onChange={handleTrousersColorChange} />
                    </div>
                </div>
                <div className="displayModelDiv" ref={canvasContainerRef}>

                    <Canvas
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Environment preset="dawn" />
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                        <OrbitControls />
                        {
                            gender === "male" ?
                                <Man
                                    scale={1.75}
                                    position={[0, -1.5, 0]}
                                    animation={"idle"}
                                    hairColor={hairColor}
                                    suitColor={suitColor}
                                    trousersColor={trousersColor}
                                />
                                :
                                <Woman scale={1.75}
                                    position={[0, -1.5, 0]}
                                    animation={"idle"}
                                    hairColor={hairColor}
                                    suitColor={suitColor}
                                    trousersColor={trousersColor} />
                        }
                    </Canvas>
                </div>
            </div>
            <input type="button" onClick={onRoomConnect} value={"Connect"} />
        </div>
    )
}