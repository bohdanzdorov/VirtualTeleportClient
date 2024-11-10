import "./App.css"

import { useState } from "react"
import { Physics } from '@react-three/cannon'
import { Canvas } from '@react-three/fiber'
import { SocketManager } from './components/SocketManager'
import { Teleport } from './components/Teleport'
import { KeyboardControls } from '@react-three/drei'

import { MicButton } from "./components/UI/MicButton"


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

  const switchMicState = () => {
    setMicState(!micState)
  }

  return (
    <>
      <KeyboardControls map={keyBoardMap}>
        <MicButton micState={micState} setMicState={setMicState} switchMicState={switchMicState}/>
        <Canvas shadows>
          <Physics allowSleep={false}>
            <Teleport />
          </Physics>
        </Canvas>
        <SocketManager micState={micState}/>
      </KeyboardControls>
    </>
  )
}

export default App
