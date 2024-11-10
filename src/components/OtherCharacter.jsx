import { useRef } from "react"
import { Character } from "./Character";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three"

export const OtherCharacter = (props) => {

    const character = useRef();
    const container = useRef();

    const rb = useRef();

    useFrame(() => {
        character.current.rotation.y = props.rotation
        rb.current.setTranslation(
            new THREE.Vector3(
                props.position[0],
                props.position[1],
                props.position[2]))
        rb.current.setLinvel(props.linvel, true)
        container.current.rotation.y = props.containerRotation
    })

    return (
        <RigidBody colliders={false}
            lockRotations
            ref={rb}
            position={props.position}>
            <group ref={container}>
                <group ref={character}>
                    <Character scale={0.18}
                        animation={props.animation}
                        position-y={-0.25} />
                </group>
            </group>
            <CapsuleCollider args={[0.08, 0.15]} />
        </RigidBody>
    )
}