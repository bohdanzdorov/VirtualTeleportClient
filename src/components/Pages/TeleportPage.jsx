import React, { useState } from 'react'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'

import { EnvironmentUI } from '../EnvironmentUI/EnvironmentUI'
import { Teleport } from './Teleport'

export const TeleportPage = (props) => {
  const [isTVVisible, setIsTVVisible] = useState(true)
  const keyBoardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "micAction", keys: ["KeyE"] },
  ]

  return (
    <KeyboardControls map={keyBoardMap}>
      <EnvironmentUI toggleMic={props.toggleMic} micEnabled={props.micEnabled}
        leaveMonitor={props.leaveMonitor} isFirstPersonView={props.isFirstPersonView}
        tvLink={props.tvLink} setTvLink={props.setTvLink}
        roomMode={props.roomMode} setRoomMode={props.setRoomMode}
        setIsMovementAllowed={props.setIsMovementAllowed}
        users={props.users}
        isTVVisible={isTVVisible} />

      <Canvas shadows
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: false, powerPreference: "high-performance", precision: "highp" }}>
        <Teleport
          users={props.users}
          occupiedWebCamTVs={props.occupiedWebCamTVs}
          tvLink={props.tvLink}
          isMovementAllowed={props.isMovementAllowed}
          roomMode={props.roomMode}
          setLocalAudioTrack={props.setLocalAudioTrack}
          isFirstPersonView={props.isFirstPersonView}
          setIsFirstPersonView={props.setIsFirstPersonView}
          isTVVisible={isTVVisible}
          setIsTVVisible={setIsTVVisible}
        />
      </Canvas>
    </KeyboardControls>
  )
}
