import { useRef } from "react"
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three"
import { Man } from "./Man";
import { Woman } from "./Woman";
import { Text } from "@react-three/drei";

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
                <Text
                    position={[0, 0.3, 0]} 
                    fontSize={0.03}
                    color="black"
                    anchorX="center"
                    anchorY="bottom"
                >
                    {props.name}
                </Text>
                <group ref={character}>
                    {
                        props.gender === "male" ?
                            <Man
                                scale={0.27}
                                animation={props.animation}
                                position-y={-0.25}
                                name={props.name}
                                hairColor={props.hairColor}
                                suitColor={props.suitColor}
                                trousersColor={props.trousersColor} />
                            : <Woman
                                scale={0.27}
                                animation={props.animation}
                                position-y={-0.25}
                                name={props.name}
                                hairColor={props.hairColor}
                                suitColor={props.suitColor}
                                trousersColor={props.trousersColor} />
                    }
                </group>
            </group>
            <CapsuleCollider args={[0.21, 0.07]} />
        </RigidBody>
    )
}