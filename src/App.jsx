import './styles/Environment.css'

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'

import { socket, SocketManager } from './components/SocketManager'

import { MainMenuPage } from "./components/pages/MainMenuPage"
import { ChooseMonitorPage } from "./components/pages/ChooseMonitorPage"
import { EnvironmentUI } from './components/EnvironmentUI/EnvironmentUI'
import { Teleport } from './components/Pages/Teleport'

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

  //0 - main menu
  //1 - environment room
  //2 - monitor selection menu
  const [currentPage, setCurrentPage] = useState(0)
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
    socket.emit("freeWebCamTV", {
      userId: socket.id
    })
    setIsFirstPersonView(false)
  }

  const setMainPage = () => { setCurrentPage(0) }
  const setEnvironmentPage = () => { setCurrentPage(1) }
  const setChooseMonitorPage = () => {
    socket.emit("monitorModeConnect")
    setCurrentPage(2) 
  }

  return (
    <>
      <SocketManager users={users} setUsers={setUsers} setOccupiedWebCamTvs={setOccupiedWebCamTvs} setTvLink={setTvLink} />
      {
        currentPage === 0 ? <MainMenuPage setEnvironmentPage={setEnvironmentPage} setChooseMonitorPage={setChooseMonitorPage} />
          : currentPage === 1 ?
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
                  <Teleport users={users} occupiedWebCamTVs={occupiedWebCamTVs} tvLink={tvLink} isMovementAllowed={isMovementAllowed} roomMode={roomMode} setLocalAudioTrack={setLocalAudioTrack} isFirstPersonView={isFirstPersonView} setIsFirstPersonView={setIsFirstPersonView} />
                </Physics>
              </Canvas>
            </KeyboardControls>
            : currentPage === 2 ?
              <ChooseMonitorPage occupiedWebCamTVs={occupiedWebCamTVs} setMainPage={setMainPage}/>
            : <></>
      }
    </>
  )
}

export default App
