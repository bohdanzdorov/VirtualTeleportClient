import "./App.css"

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { socket, SocketManager } from './components/environment/SocketManager'
import { Teleport } from './components/environment/Teleport'
import { KeyboardControls } from '@react-three/drei'

import { MainMenuPage } from "./components/pages/MainMenuPage"
import { EnvironmentUI } from "./components/environment/UI/EnvironmentUI"

function App() {
  const keyBoardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "micAction", keys: ["KeyE"] },
  ]


  const [users, setUsers] = useState([])
  const [occupiedWebCamTVs, setOccupiedWebCamTvs] = useState([])

  const [isConnectedtoRoom, setIsConnectedToRoom] = useState(false)
  const [isMovementAllowed, setIsMovementAllowed] = useState(true)

  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  

  const [tvLink, setTvLink] = useState("https://www.youtube.com/embed/oozh-69e5NU")
  const [roomMode, setRoomMode] = useState("Empty")

  const [micEnabled, setMicEnabled] = useState(true);
  const [isFirstPersonView, setIsFirstPersonView] = useState(false)

  const toggleMic = async () => {
    if (!localAudioTrack) return;
    await localAudioTrack.setEnabled(!micEnabled);
    setMicEnabled(prev => !prev);
  };

  const leaveMonitor = () => {
    //TODO: Add socket on leave monitor
    socket.emit("freeWebCamTV", {
        userId: socket.id
    })
    setIsFirstPersonView(false)
  }

  return (
    <>
      {
        isConnectedtoRoom ?
          <KeyboardControls map={keyBoardMap}>
            <EnvironmentUI toggleMic={toggleMic} micEnabled={micEnabled}
            leaveMonitor={leaveMonitor} isFirstPersonView={isFirstPersonView}
              tvLink={tvLink} setTvLink={setTvLink}
              roomMode={roomMode} setRoomMode={setRoomMode}
              setIsMovementAllowed={setIsMovementAllowed}
              users={users} />

            <Canvas shadows
              dpr={Math.min(window.devicePixelRatio, 1.5)}
              gl={{ antialias: false, powerPreference: "high-performance", precision: "highp" }}>
              <Physics allowSleep={false}>
                <Teleport users={users} occupiedWebCamTVs={occupiedWebCamTVs} tvLink={tvLink} isMovementAllowed={isMovementAllowed} roomMode={roomMode} setLocalAudioTrack={setLocalAudioTrack} isFirstPersonView={isFirstPersonView} setIsFirstPersonView={setIsFirstPersonView}/>
              </Physics>
            </Canvas>
            <SocketManager users={users} setUsers={setUsers} setOccupiedWebCamTvs={setOccupiedWebCamTvs} setTvLink={setTvLink} />
          </KeyboardControls>
          :
          <MainMenuPage setIsConnectedToRoom={setIsConnectedToRoom} />
      }
    </>
  )
}

export default App
