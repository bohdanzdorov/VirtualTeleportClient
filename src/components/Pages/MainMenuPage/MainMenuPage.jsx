import './MainMenuPage.css'

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei";

import { socket } from "../../SocketManager"

import { Man } from '../../Environment/Models/Man';
import { Woman } from '../../Environment/Models/Woman';

export const MainMenuPage = (props) => {

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const { profileDraft, setProfileDraft } = props;
    const draft = profileDraft ?? {
        name: "",
        gender: "male",
        hairColor: "#553211",
        suitColor: "#000000",
        trousersColor: "#000000"
    };
    const { name, gender, hairColor, suitColor, trousersColor } = draft;

    const handleNameChange = (e) => {
        const value = e.target.value;
        setProfileDraft?.((prev) => ({ ...prev, name: value }));
        if (errorMessage) setErrorMessage("");
    };

    const handleRoomIdChange = (e) => {
        const val = (e.target.value || "").toUpperCase();
        props.setRoomId?.(val);
        if (errorMessage) setErrorMessage("");
    };

    const validateInputs = (requireRoomId = false) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setErrorMessage("Please enter your name before continuing.");
            return false;
        }

        if (trimmedName.length > 28) {
            setErrorMessage("Name is too long. Please use 28 characters or fewer.");
            return false;
        }

        if (!/^[A-Za-z0-9\s'-]+$/.test(trimmedName)) {
            setErrorMessage("Name can include letters, numbers, spaces, apostrophes, or dashes only.");
            return false;
        }

        if (requireRoomId) {
            const normalized = (props.roomId || "").trim().toUpperCase();
            if (!normalized) {
                setErrorMessage("Enter a room ID or create a new room.");
                return false;
            }
            if (!/^[A-Z0-9]{4,10}$/.test(normalized)) {
                setErrorMessage("Room ID should be 4-10 characters (letters/numbers only).");
                return false;
            }
        }

        setErrorMessage("");
        return true;
    };

    const onRoomConnect = (targetRoomId) => {
        const normalizedRoomId = (targetRoomId || props.roomId || "").trim().toUpperCase();
        const displayName = name.trim() || "User";
        setErrorMessage("");
        props.setProfile?.({
            name: displayName,
            gender,
            hairColor,
            suitColor,
            trousersColor,
            roomId: normalizedRoomId,
        });
        socket.emit("roomConnect", {
            name: displayName,
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
        if (!validateInputs(false)) return;
        const newRoomId = generateRoomId();
        props.setRoomId?.(newRoomId);
        onRoomConnect(newRoomId);
    };

    const handleJoinRoom = () => {
        if (!validateInputs(true)) return;
        const normalizedRoomId = (props.roomId || "").trim().toUpperCase();
        props.setRoomId?.(normalizedRoomId);
        onRoomConnect(normalizedRoomId);
    };

    return (
        <div className="mainDiv">
            <h2 className="title">Virtual Teleport 🛸</h2>
            <div className="mainMenuGrid">
                <div className="roomControls">
                    <h3 className="roomControlsTitle">Enter a space</h3>
                    <p className="roomControlsHint">Share your display name, create a fresh room, or jump into an existing one.</p>
                    <input
                        className="nameField roomNameField"
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={handleNameChange}
                    />
                    <button className="menuButton roomButton" onClick={handleCreateRoom}>Create room</button>
                    <div className="roomInputGroup">
                        <input
                            id="roomId"
                            className="nameField roomInput"
                            type="text"
                            placeholder="Room ID"
                            value={props.roomId || ""}
                            onChange={handleRoomIdChange}
                        />
                    </div>
                    <button className="menuButton roomButton" onClick={handleJoinRoom}>Connect to room</button>
                    {errorMessage && (
                        <div className="menuError" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="previewCard">
                    <div className="previewHeader">
                        <h3>Avatar preview</h3>
                        <p>Your character updates live as you customise it.</p>
                    </div>
                    <div className="previewCanvas">
                        <Canvas style={{ width: "100%", height: "100%" }}>
                            <Environment preset="dawn" />
                            <OrbitControls minDistance={2} maxDistance={3} />
                            {gender === "male" ? (
                                <Man scale={1.75} position={[0, -1.5, 0]} animation="idle" hairColor={hairColor} suitColor={suitColor} trousersColor={trousersColor} />
                            ) : (
                                <Woman scale={1.75} position={[0, -1.5, 0]} animation="idle" hairColor={hairColor} suitColor={suitColor} trousersColor={trousersColor} />
                            )}
                        </Canvas>
                    </div>
                    <button
                        type="button"
                        className="editorLaunchButton"
                        onClick={() => navigate('/character-editor')}
                    >
                        Open character editor
                    </button>
                </div>
            </div>
        </div>
    );
};
