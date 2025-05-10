import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, OrbitControls, Environment } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { socket } from "../environment/SocketManager"
import { Man } from "../environment/Man";
import { Woman } from "../environment/Woman";
import '../../styles/MainMenuPage.css'

export const MainMenuPage = (props) => {

    const canvasContainerRef = useRef();
    const [name, setName] = useState("");
    const [gender, setGender] = useState("male");
    const [hairColor, setHairColor] = useState("#553211");
    const [suitColor, setSuitColor] = useState("#000000");
    const [trousersColor, setTrousersColor] = useState("#000000");

    const handleNameChange = (e) => setName(e.target.value);
    const handleGenderChange = (e) => setGender(e.target.value);
    const handleHairColorChange = (e) => setHairColor(e.target.value);
    const handleSuitColorChange = (e) => setSuitColor(e.target.value);
    const handleTrousersColorChange = (e) => setTrousersColor(e.target.value);

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
            name,
            gender,
            hairColor,
            suitColor,
            trousersColor
        });
        props.setEnvironmentPage();
    };

    return (
        <div className="mainDiv">
            <button className="monitorModeButton" onClick={props.setChooseMonitorPage}>Monitor Mode</button>
            <h2 className="title">Virtual Teleport 🛸</h2>

            <input
                className="nameField"
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={handleNameChange}
            />

            <div className="characterEditorDiv">
                <div className="inputBoxesDiv">
                    <div className="genderBox">
                        <div className="inputGroupLabel">Gender</div>
                        <div className="genderOptions">
                            <label className="genderOption">
                                <input
                                    type="radio"
                                    value="male"
                                    checked={gender === "male"}
                                    onChange={handleGenderChange}
                                />
                                Male
                            </label>
                            <label className="genderOption">
                                <input
                                    type="radio"
                                    value="female"
                                    checked={gender === "female"}
                                    onChange={handleGenderChange}
                                />
                                Female
                            </label>
                        </div>
                    </div>

                    <div className="editorBox">
                        <label htmlFor="hairColor">Hair</label>
                        <input
                            type="color"
                            id="hairColor"
                            value={hairColor}
                            onChange={handleHairColorChange}
                        />
                    </div>

                    <div className="editorBox">
                        <label htmlFor="suitColor">Suit</label>
                        <input
                            type="color"
                            id="suitColor"
                            value={suitColor}
                            onChange={handleSuitColorChange}
                        />
                    </div>

                    <div className="editorBox">
                        <label htmlFor="pantsColor">Pants</label>
                        <input
                            type="color"
                            id="pantsColor"
                            value={trousersColor}
                            onChange={handleTrousersColorChange}
                        />
                    </div>
                </div>

                <div className="displayModelDiv" ref={canvasContainerRef}>
                    <Canvas style={{ width: "100%", height: "100%" }}>
                        <Environment preset="dawn" />
                        <OrbitControls minDistance={2} maxDistance={3}/>
                        {gender === "male" ? (
                            <Man scale={1.75} position={[0, -1.5, 0]} animation="idle" hairColor={hairColor} suitColor={suitColor} trousersColor={trousersColor} />
                        ) : (
                            <Woman scale={1.75} position={[0, -1.5, 0]} animation="idle" hairColor={hairColor} suitColor={suitColor} trousersColor={trousersColor} />
                        )}
                    </Canvas>
                </div>
            </div>

            <button className="menuButton" onClick={onRoomConnect}>Connect</button>
        </div>
    );
};
