import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { EnvironmentUI } from '../EnvironmentUI/EnvironmentUI'
import { Teleport } from './Teleport'

export const TeleportPage = (props) => {
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
        isTVVisible={props.isTVVisible}
        roomId={props.roomId}
        toggleCam={props.toggleCam}
        camEnabled={props.camEnabled}
      />

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
          setLocalVideoTrack={props.setLocalVideoTrack}
             localVideoTrack={props.localVideoTrack}
          setAgoraClient={props.setAgoraClient}
          isFirstPersonView={props.isFirstPersonView}
          setIsFirstPersonView={props.setIsFirstPersonView}
          isTVVisible={props.isTVVisible}
          setIsTVVisible={props.setIsTVVisible}
          roomId={props.roomId}
        />
      </Canvas>
    </KeyboardControls>
  )
}
