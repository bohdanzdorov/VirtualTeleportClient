import "./App.css"

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { SocketManager } from './components/SocketManager'
import { Teleport } from './components/Teleport'
import { KeyboardControls } from '@react-three/drei'

import { MicButton } from "./components/UI/MicButton"
import {socket} from "./components/SocketManager"

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

  const [isConnected, setIsConnected] = useState(false)

  const switchMicState = () => {
    setMicState(!micState)
  }

  const connectToRoom = () => {
    socket.emit("roomConnect")
    setIsConnected(true)
  }

  return (
    <>
    <p>{users.length}</p>
    {
      isConnected ? 
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
      <div>
        <input type="button" onClick={connectToRoom} value={"Connect"}/>
      </div>
     
    }
   
    </>
  )
}

export default App
