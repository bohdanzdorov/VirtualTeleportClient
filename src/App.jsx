import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { socket, SocketManager } from './components/SocketManager'

import { MainMenuPage } from "./components/Pages/MainMenuPage/MainMenuPage"
import { TeleportPage } from './components/Pages/TeleportPage/TeleportPage'
import { CharacterEditorPage } from "./components/Pages/CharacterEditorPage/CharacterEditorPage"

function App() {
  const [users, setUsers] = useState([])
  const [occupiedWebCamTVs, setOccupiedWebCamTvs] = useState([])

  const [isMovementAllowed, setIsMovementAllowed] = useState(true)

  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [agoraClient, setAgoraClient] = useState(null);

  const [tvLink, setTvLink] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ")
  const [roomMode, setRoomMode] = useState("Empty")
  const [isTVVisible, setIsTVVisible] = useState(true)
  const [roomId, setRoomId] = useState("")
  const [profile, setProfile] = useState(null)
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    gender: "male",
    hairColor: "#553211",
    suitColor: "#000000",
    trousersColor: "#000000"
  })

  const [micEnabled, setMicEnabled] = useState(true);
  const [isFirstPersonView, setIsFirstPersonView] = useState(false)

  const toggleMic = async () => {
    if (!localAudioTrack) return;
    await localAudioTrack.setEnabled(!micEnabled);
    setMicEnabled(prev => !prev);
  };

  const [camEnabled, setCamEnabled] = useState(true);

  const toggleCam = async () => {
    if (!localVideoTrack || !agoraClient) return;
    if (camEnabled) {
        await agoraClient.unpublish([localVideoTrack]);
        await localVideoTrack.setEnabled(false);
        setCamEnabled(false);
    } else {
        await localVideoTrack.setEnabled(true);
        await agoraClient.publish([localVideoTrack]);
        setCamEnabled(true);
    }
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
        <Route
          path="/"
          element={(
            <MainMenuPage
              roomId={roomId}
              setRoomId={setRoomId}
              setProfile={setProfile}
              profileDraft={profileDraft}
              setProfileDraft={setProfileDraft}
            />
          )}
        />
        <Route
          path="/character-editor"
          element={(
            <CharacterEditorPage
              profileDraft={profileDraft}
              setProfileDraft={setProfileDraft}
            />
          )}
        />
        <Route path="/teleport" element={profile ? (
          <TeleportPage
          users={users}
          occupiedWebCamTVs={occupiedWebCamTVs}
          tvLink={tvLink}
          isMovementAllowed={isMovementAllowed}
          roomMode={roomMode}
          setLocalAudioTrack={setLocalAudioTrack}
          setLocalVideoTrack={setLocalVideoTrack}
          localVideoTrack={localVideoTrack}
          setAgoraClient={setAgoraClient}
          isFirstPersonView={isFirstPersonView}
          setIsFirstPersonView={setIsFirstPersonView}
          toggleMic={toggleMic}
          micEnabled={micEnabled}
          toggleCam={toggleCam}
          camEnabled={camEnabled}
          leaveMonitor={leaveMonitor}
          setTvLink={setTvLink}
          setIsMovementAllowed={setIsMovementAllowed}
          setRoomMode={setRoomMode}
          isTVVisible={isTVVisible}
          setIsTVVisible={setIsTVVisible}
          roomId={roomId}
        />) : (
          <Navigate to="/" replace />
        )} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
