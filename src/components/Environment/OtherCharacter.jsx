import { useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

import { Man } from "./Models/Man";
import { Woman } from "./Models/Woman";

/*
    Component used to display real-time avatars of other users
    Serves as a wrapper around 3D avatar model
*/
export const OtherCharacter = (props) => {

    const character = useRef();
    const container = useRef();

    const rb = useRef();

    //Every frame update the model's position and rotation
    useFrame(() => {
        character.current.rotation.x = props.rotation[0]
        character.current.rotation.y = props.rotation[1]
        character.current.rotation.z = props.rotation[2]
        
        rb.current.setTranslation(
            new THREE.Vector3(
                props.position[0],
                props.position[1],
                props.position[2]))
    })

    return (
        <RigidBody
            type="kinematicPosition"
            colliders={false}
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
                                scale={1}
                                animation={props.animation}
                                position-y={-0.7}
                                name={props.name}
                                hairColor={props.hairColor}
                                suitColor={props.suitColor}
                                trousersColor={props.trousersColor} />
                            : <Woman
                                scale={1}
                                animation={props.animation}
                                position-y={-0.7}
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