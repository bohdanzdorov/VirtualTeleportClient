import '../../styles/MainMenuPage.css'

import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei";

import { socket } from "../SocketManager"

import { Man } from '../Environment/Models/Man';
import { Woman } from '../Environment/Models/Woman';

export const MainMenuPage = (props) => {

    const canvasContainerRef = useRef();
    const [name, setName] = useState("");
    const [gender, setGender] = useState("male");
    const [hairColor, setHairColor] = useState("#553211");
    const [suitColor, setSuitColor] = useState("#000000");
    const [trousersColor, setTrousersColor] = useState("#000000");
    const [roomId, setRoomId] = useState(props.roomId || "");

    const handleNameChange = (e) => setName(e.target.value);
    const handleGenderChange = (e) => setGender(e.target.value);
    const handleHairColorChange = (e) => setHairColor(e.target.value);
    const handleSuitColorChange = (e) => setSuitColor(e.target.value);
    const handleTrousersColorChange = (e) => setTrousersColor(e.target.value);
    const handleRoomIdChange = (e) => {
        const val = (e.target.value || "").toUpperCase();
        setRoomId(val);
    };

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

    const navigate = useNavigate();

    const onRoomConnect = (targetRoomId) => {
        const normalizedRoomId = (targetRoomId || roomId || "").trim().toUpperCase();
        socket.emit("roomConnect", {
            name,
            gender,
            hairColor,
            suitColor,
            trousersColor,
            roomId: normalizedRoomId
        });
        props.setRoomId?.(normalizedRoomId);
        navigate('/teleport');
    };

    const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

    const handleCreateRoom = () => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        props.setRoomId?.(newRoomId);
        onRoomConnect(newRoomId);
    };

    const handleJoinRoom = () => {
        const normalizedRoomId = (roomId || "").trim().toUpperCase();
        setRoomId(normalizedRoomId);
        props.setRoomId?.(normalizedRoomId);
        onRoomConnect(normalizedRoomId);
    };

    return (
        <div className="mainDiv">
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

            <div className="roomControls">
                <div className="roomInputGroup">
                    <label className="inputGroupLabel" htmlFor="roomId">Room ID</label>
                    <input
                        id="roomId"
                        className="nameField"
                        type="text"
                        placeholder="Enter room ID to join..."
                        value={roomId}
                        onChange={handleRoomIdChange}
                    />
                </div>
                <div className="roomButtons">
                    <button className="menuButton" onClick={handleCreateRoom}>Create room</button>
                    <button className="menuButton" onClick={handleJoinRoom}>Connect to room</button>
                </div>
            </div>
        </div>
    );
};
