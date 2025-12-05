import './styles/Environment.css'

import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { socket, SocketManager } from './components/SocketManager'

import { MainMenuPage } from "./components/Pages/MainMenuPage"
import { TeleportPage } from './components/Pages/TeleportPage'

function App() {
  const [users, setUsers] = useState([])
  const [occupiedWebCamTVs, setOccupiedWebCamTvs] = useState([])

  const [isMovementAllowed, setIsMovementAllowed] = useState(true)

  const [localAudioTrack, setLocalAudioTrack] = useState(null);

  const [tvLink, setTvLink] = useState("https://www.youtube.com/embed/oozh-69e5NU")
  const [roomMode, setRoomMode] = useState("Empty")
  const [isTVVisible, setIsTVVisible] = useState(true)
  const [roomId, setRoomId] = useState("")

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

  return (
    <BrowserRouter>
      <SocketManager users={users} setUsers={setUsers} setOccupiedWebCamTvs={setOccupiedWebCamTvs} setTvLink={setTvLink} setIsTVVisible={setIsTVVisible} />
      <Routes>
        <Route path="/" element={<MainMenuPage roomId={roomId} setRoomId={setRoomId} />} />
        <Route path="/teleport" element={<TeleportPage
          users={users}
          occupiedWebCamTVs={occupiedWebCamTVs}
          tvLink={tvLink}
          isMovementAllowed={isMovementAllowed}
          roomMode={roomMode}
          setLocalAudioTrack={setLocalAudioTrack}
          isFirstPersonView={isFirstPersonView}
          setIsFirstPersonView={setIsFirstPersonView}
          toggleMic={toggleMic}
          micEnabled={micEnabled}
          leaveMonitor={leaveMonitor}
          setTvLink={setTvLink}
          setIsMovementAllowed={setIsMovementAllowed}
          setRoomMode={setRoomMode}
          isTVVisible={isTVVisible}
          setIsTVVisible={setIsTVVisible}
          roomId={roomId}
        />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
