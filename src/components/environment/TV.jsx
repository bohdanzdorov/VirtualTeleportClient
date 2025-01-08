import { Html, useGLTF } from "@react-three/drei"

export default function TV(props) {
    const tv = useGLTF(
        "/models/model2.glb"
    )
    return (
        <>
            <primitive object={tv.scene} position={props.position} rotation={props.rotation} scale={props.scale}>
                <Html
                    position={[-0.45, 0.35, 0]}
                    distanceFactor={1.2}
                    transform
                >
                    <iframe style={{width: "1350px", height: "760px", border:"none", borderRadius: "10px",position: "relative" ,zIndex: "0"}} 
                    src={props.url}/>
                </Html>
            </primitive>   
        </>
    );
}