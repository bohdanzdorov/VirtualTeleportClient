import "./App.css"

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { SocketManager } from './components/environment/SocketManager'
import { Teleport } from './components/environment/Teleport'
import { KeyboardControls } from '@react-three/drei'

import { MicButton } from "./components/environment/UI/MicButton"
import {socket} from "./components/environment/SocketManager"
import { MainMenuPage } from "./components/pages/MainMenuPage"

function App() {
  const keyBoardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "micAction", keys: ["KeyE"]},
  ]

  const [micState, setMicState] = useState(false);
  const [users, setUsers] = useState([])

  const [isConnectedtoRoom, setIsConnectedToRoom] = useState(false)

  const switchMicState = () => {
    setMicState(!micState)
  }

  const onRoomConnect = () => {
    socket.emit("roomConnect")
    setIsConnectedToRoom(true)
  }

  return (
    <>
    {
      isConnectedtoRoom ? 
      <KeyboardControls map={keyBoardMap}>
      <MicButton micState={micState} setMicState={setMicState} switchMicState={switchMicState}/>
      <Canvas shadows>
        <Physics allowSleep={false}>
          <Teleport users={users}/>
        </Physics>
      </Canvas>
      <SocketManager micState={micState} users={users} setUsers={setUsers}/>
    </KeyboardControls>
    :
      <MainMenuPage onRoomConnect={onRoomConnect}/>
    }
   
    </>
  )
}

export default App
