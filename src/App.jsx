import "./App.css"

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { SocketManager } from './components/environment/SocketManager'
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

  const [micState, setMicState] = useState(false);
  const [tvLink, setTvLink] = useState("https://www.youtube.com/embed/yGzqD-g2gts")

  const [users, setUsers] = useState([])

  const [isConnectedtoRoom, setIsConnectedToRoom] = useState(false)
  const [isMovementAllowed, setIsMovementAllowed] = useState(true)

  const switchMicState = () => {
    setMicState(!micState)
  }

  return (
    <>
      {
        isConnectedtoRoom ?
          <KeyboardControls map={keyBoardMap}>
            <EnvironmentUI micState={micState} setMicState={setMicState} switchMicState={switchMicState} tvLink={tvLink} setTvLink={setTvLink} setIsMovementAllowed={setIsMovementAllowed}/>
            <Canvas shadows>
              <Physics allowSleep={false}>
                <Teleport users={users} tvLink={tvLink} isMovementAllowed={isMovementAllowed} />
              </Physics>
            </Canvas>
            <SocketManager micState={micState} users={users} setUsers={setUsers} />
          </KeyboardControls>
          :
          <MainMenuPage setIsConnectedToRoom={setIsConnectedToRoom} />
      }
    </>
  )
}

export default App
